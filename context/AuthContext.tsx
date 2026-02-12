import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getDatabase } from '@/database/connection';
import { initializeSchema } from '@/database/schema';
import { seedDatabase } from '@/database/seed';
import * as InstructorRepo from '@/database/repositories/instructorRepository';
import * as StudentRepo from '@/database/repositories/studentRepository';
import * as AppointmentRepo from '@/database/repositories/appointmentRepository';
import * as AddressRepo from '@/database/repositories/savedAddressRepository';
import * as FavoriteRepo from '@/database/repositories/favoriteRepository';
import * as LocationRepo from '@/database/repositories/locationRepository';
import * as SettingsRepo from '@/database/repositories/settingsRepository';
import * as UserRepo from '@/database/repositories/userRepository';
import { simpleHash } from '@/utils/hash';

// --- Type Definitions ---
export type Instructor = {
  id: string;
  name: string;
  car: string;
  carImage: string;
  rating: number;
  pricePerHour: number;
  transmission: 'Manual' | 'Auto';
  bio: string;
  reviews: { student: string; comment: string; rating: number }[];
  availability: { day: string; time: string }[];
  profileImage: string;
  coverImage: string;
  specialties: string[];
  isAvailable: boolean;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type Student = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export type SavedAddress = {
  id: string;
  label: string;
  street: string;
  neighborhood: string;
};

export type PaymentMethod = 'PIX' | 'Cartão';

export type Appointment = {
  id: string;
  studentId: string;
  instructorId: string;
  date: string;
  time: string;
  location: string;
  status: 'Pendente' | 'Aceita' | 'Recusada';
  price: number;
  address?: string;
  paymentMethod?: PaymentMethod;
  serviceFee?: number;
  discount?: number;
  totalPrice?: number;
};

export type InstructorProfileData = {
  fullName: string;
  cpf: string;
  cnh: string;
  hasEAR: boolean;
  carModel: string;
  year: string;
  transmission: 'Manual' | 'Auto';
};

export type SignupStage = 'idle' | 'choose_role' | 'complete_student' | 'complete_instructor';

// --- Context Definition ---
export type UserRole = 'student' | 'instructor' | null;

interface AuthContextType {
  isLoading: boolean;
  userRole: UserRole;
  signupStage: SignupStage;
  currentStudent: Student;
  currentInstructor: Instructor | null;
  students: Student[];
  instructors: Instructor[];
  appointments: Appointment[];
  locations: string[];
  savedAddresses: SavedAddress[];
  favoriteInstructorIds: string[];
  setUserRole: (role: UserRole) => void;
  setSignupStage: (stage: SignupStage) => void;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeStudentProfile: () => Promise<void>;
  completeInstructorProfile: (data: InstructorProfileData) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: 'Aceita' | 'Recusada') => void;
  toggleFavorite: (instructorId: string) => void;
  updateStudentInfo: (updates: Partial<Student>) => void;
  updateInstructorInfo: (updates: Partial<Instructor>) => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeSavedAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateId(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${Date.now()}-${random}`;
}

// --- Auth Provider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [signupStage, setSignupStage] = useState<SignupStage>('idle');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<{
    name: string; email: string; phone: string;
  } | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student>({ id: '', name: '' });
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [favoriteInstructorIds, setFavoriteInstructorIds] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Initialize database and load all data
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const db = await getDatabase();
        await initializeSchema(db);
        await seedDatabase(db);

        const [
          dbInstructors,
          dbStudents,
          dbAppointments,
          dbAddresses,
          dbLocations,
          dbRole,
          dbUserId,
        ] = await Promise.all([
          InstructorRepo.getAllInstructors(),
          StudentRepo.getAllStudents(),
          AppointmentRepo.getAllAppointments(),
          AddressRepo.getAllSavedAddresses(),
          LocationRepo.getAllLocations(),
          SettingsRepo.getSetting('userRole'),
          SettingsRepo.getSetting('currentUserId'),
        ]);

        if (!mounted) return;

        setInstructors(dbInstructors);
        setStudents(dbStudents);
        setAppointments(dbAppointments);
        setSavedAddresses(dbAddresses);
        setLocations(dbLocations);

        // Load the correct user based on stored userId
        let loadedStudent: Student | null = null;
        let loadedInstructor: Instructor | null = null;

        if (dbUserId) {
          setCurrentUserId(dbUserId);
          const user = await UserRepo.getUserById(dbUserId);
          if (user) {
            if (user.role === 'student' && user.student_id) {
              loadedStudent = await StudentRepo.getStudentById(user.student_id);
            } else if (user.role === 'instructor' && user.instructor_id) {
              loadedInstructor = await InstructorRepo.getInstructorById(user.instructor_id);
            }
          }
        }

        if (loadedStudent) {
          setCurrentStudent(loadedStudent);
        } else if (dbStudents.length > 0) {
          setCurrentStudent(dbStudents[0]);
        }

        if (loadedInstructor) {
          setCurrentInstructor(loadedInstructor);
        } else if (dbInstructors.length > 0) {
          setCurrentInstructor(dbInstructors[0]);
        }

        if (dbRole === 'student' || dbRole === 'instructor') {
          setUserRoleState(dbRole);
        }

        // Load favorites for current student
        const studentForFavorites = loadedStudent || (dbStudents.length > 0 ? dbStudents[0] : null);
        if (studentForFavorites) {
          const favIds = await FavoriteRepo.getFavoriteInstructorIds(studentForFavorites.id);
          if (mounted) setFavoriteInstructorIds(favIds);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    SettingsRepo.setSetting('userRole', role).catch(console.error);
  }, []);

  const signup = useCallback(async (data: {
    name: string; email: string; phone: string; password: string;
  }) => {
    const existingUser = await UserRepo.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const userId = generateId('user');
    const passwordHash = simpleHash(data.password);

    await UserRepo.createUser({
      id: userId,
      email: data.email,
      password_hash: passwordHash,
      role: null,
      student_id: null,
      instructor_id: null,
    });

    setCurrentUserId(userId);
    await SettingsRepo.setSetting('currentUserId', userId);

    setPendingSignupData({ name: data.name, email: data.email, phone: data.phone });
    setSignupStage('choose_role');
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = await UserRepo.getUserByEmail(email);
    if (!user) return false;

    if (user.password_hash !== simpleHash(password)) return false;

    setCurrentUserId(user.id);
    await SettingsRepo.setSetting('currentUserId', user.id);

    if (user.role === 'student' && user.student_id) {
      const student = await StudentRepo.getStudentById(user.student_id);
      if (student) setCurrentStudent(student);
      setUserRoleState('student');
      await SettingsRepo.setSetting('userRole', 'student');
      setSignupStage('idle');
    } else if (user.role === 'instructor' && user.instructor_id) {
      const instructor = await InstructorRepo.getInstructorById(user.instructor_id);
      if (instructor) setCurrentInstructor(instructor);
      setUserRoleState('instructor');
      await SettingsRepo.setSetting('userRole', 'instructor');
      setSignupStage('idle');
    } else {
      setSignupStage('choose_role');
    }

    return true;
  }, []);

  const logout = useCallback(() => {
    setUserRoleState(null);
    setCurrentUserId(null);
    setSignupStage('idle');
    setPendingSignupData(null);
    setCurrentStudent({ id: '', name: '' });
    setCurrentInstructor(null);
    SettingsRepo.setSetting('userRole', null).catch(console.error);
    SettingsRepo.setSetting('currentUserId', null).catch(console.error);
  }, []);

  const completeStudentProfile = useCallback(async () => {
    if (!currentUserId || !pendingSignupData) return;

    const studentId = generateId('stud');
    const newStudent: Student = {
      id: studentId,
      name: pendingSignupData.name,
      email: pendingSignupData.email,
      phone: pendingSignupData.phone,
    };

    await StudentRepo.addStudent(newStudent);
    await UserRepo.updateUserRole(currentUserId, 'student', studentId);

    setCurrentStudent(newStudent);
    setStudents(prev => [...prev, newStudent]);
    setUserRoleState('student');
    setSignupStage('idle');
    setPendingSignupData(null);

    await SettingsRepo.setSetting('userRole', 'student');
  }, [currentUserId, pendingSignupData]);

  const completeInstructorProfile = useCallback(async (data: InstructorProfileData) => {
    if (!currentUserId || !pendingSignupData) return;

    const instructorId = generateId('inst');
    const newInstructor: Instructor = {
      id: instructorId,
      name: data.fullName || pendingSignupData.name,
      car: data.carModel,
      carImage: '',
      rating: 0,
      pricePerHour: 0,
      transmission: data.transmission,
      bio: '',
      reviews: [],
      availability: [],
      profileImage: '',
      coverImage: '',
      specialties: [],
      isAvailable: false,
      location: '',
      coordinates: { latitude: 0, longitude: 0 },
    };

    await InstructorRepo.addInstructor(newInstructor);
    await UserRepo.updateUserRole(currentUserId, 'instructor', instructorId);

    setCurrentInstructor(newInstructor);
    setInstructors(prev => [...prev, newInstructor]);
    setUserRoleState('instructor');
    setSignupStage('idle');
    setPendingSignupData(null);

    await SettingsRepo.setSetting('userRole', 'instructor');
  }, [currentUserId, pendingSignupData]);

  const addAppointment = useCallback((newAppointment: Omit<Appointment, 'id' | 'status'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: generateId('appt'),
      status: 'Pendente',
    };
    setAppointments((prev) => [...prev, appointment]);
    AppointmentRepo.addAppointment(appointment).catch(console.error);
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: 'Aceita' | 'Recusada') => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );
    AppointmentRepo.updateAppointmentStatus(id, status).catch(console.error);
  }, []);

  const toggleFavorite = useCallback((instructorId: string) => {
    setFavoriteInstructorIds((prev) => {
      if (prev.includes(instructorId)) {
        return prev.filter((id) => id !== instructorId);
      } else {
        return [...prev, instructorId];
      }
    });
    FavoriteRepo.toggleFavorite(currentStudent.id, instructorId).catch(console.error);
  }, [currentStudent.id]);

  const updateStudentInfo = useCallback((updates: Partial<Student>) => {
    setCurrentStudent((prev) => ({ ...prev, ...updates }));
    if (currentStudent.id) {
      StudentRepo.updateStudent(currentStudent.id, updates).catch(console.error);
    }
  }, [currentStudent.id]);

  const updateInstructorInfo = useCallback((updates: Partial<Instructor>) => {
    setCurrentInstructor(prev => prev ? { ...prev, ...updates } : prev);
    if (currentInstructor?.id) {
      InstructorRepo.updateInstructor(currentInstructor.id, updates).catch(console.error);
    }
  }, [currentInstructor?.id]);

  const addSavedAddress = useCallback((address: Omit<SavedAddress, 'id'>) => {
    const newAddress: SavedAddress = {
      ...address,
      id: generateId('addr'),
    };
    setSavedAddresses((prev) => [...prev, newAddress]);
    AddressRepo.addSavedAddress(newAddress).catch(console.error);
  }, []);

  const removeSavedAddress = useCallback((id: string) => {
    setSavedAddresses((prev) => prev.filter((addr) => addr.id !== id));
    AddressRepo.removeSavedAddress(id).catch(console.error);
  }, []);

  const value = {
    isLoading,
    userRole,
    signupStage,
    currentStudent,
    currentInstructor,
    students,
    instructors,
    appointments,
    locations,
    savedAddresses,
    favoriteInstructorIds,
    setUserRole,
    setSignupStage,
    signup,
    login,
    logout,
    completeStudentProfile,
    completeInstructorProfile,
    addAppointment,
    updateAppointmentStatus,
    toggleFavorite,
    updateStudentInfo,
    updateInstructorInfo,
    addSavedAddress,
    removeSavedAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook for Auth Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
