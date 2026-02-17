import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Alert } from 'react-native';
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
import type { StudentSignupData } from '@/screens/StudentSignupScreen';
import type { InstructorSignupData } from '@/screens/instructor/InstructorSignupScreen';

// --- Type Definitions ---
export type VehicleType = 'Carro' | 'Moto' | 'Caminhão' | 'Ônibus' | 'Articulado';

export type Instructor = {
  id: string;
  name: string;
  car: string;
  carImage: string;
  vehicleType: VehicleType;
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
  cpf?: string;
  birthDate?: string;
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
  status: 'Pendente' | 'Aceita' | 'Recusada' | 'Cancelada';
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
  showTutorial: boolean;
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
  signupStudent: (data: StudentSignupData) => Promise<void>;
  signupInstructor: (data: InstructorSignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeTutorial: () => void;
  completeStudentProfile: () => Promise<void>;
  completeInstructorProfile: (data: InstructorProfileData) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: 'Aceita' | 'Recusada' | 'Cancelada') => void;
  cancelAppointment: (id: string) => void;
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
  const [showTutorial, setShowTutorial] = useState(false);

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
          dbLocations,
          dbRole,
          dbUserId,
        ] = await Promise.all([
          InstructorRepo.getAllInstructors(),
          StudentRepo.getAllStudents(),
          AppointmentRepo.getAllAppointments(),
          LocationRepo.getAllLocations(),
          SettingsRepo.getSetting('userRole'),
          SettingsRepo.getSetting('currentUserId'),
        ]);

        if (!mounted) return;

        setInstructors(dbInstructors);
        setStudents(dbStudents);
        setAppointments(dbAppointments);
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
          // Load addresses and favorites scoped to this student
          const [studentAddresses, favIds] = await Promise.all([
            AddressRepo.getSavedAddressesByStudent(loadedStudent.id),
            FavoriteRepo.getFavoriteInstructorIds(loadedStudent.id),
          ]);
          if (mounted) {
            setSavedAddresses(studentAddresses);
            setFavoriteInstructorIds(favIds);
          }
        } else {
          setSavedAddresses([]);
          setFavoriteInstructorIds([]);
        }

        if (loadedInstructor) {
          setCurrentInstructor(loadedInstructor);
        }

        if (dbRole === 'student' || dbRole === 'instructor') {
          setUserRoleState(dbRole);
          // Check tutorial flag
          const tutorialKey = `hasSeenTutorial_${dbUserId}`;
          const hasSeen = await SettingsRepo.getSetting(tutorialKey);
          if (mounted && !hasSeen) {
            setShowTutorial(true);
          }
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

  // Legacy signup (kept for backward compat with login flow for incomplete profiles)
  const signup = useCallback(async (data: {
    name: string; email: string; phone: string; password: string;
  }) => {
    const existingUser = await UserRepo.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Este e-mail ja esta cadastrado.');
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

  // New: signup student directly (role already chosen)
  const signupStudent = useCallback(async (data: StudentSignupData) => {
    // Check email uniqueness
    const existingEmail = await UserRepo.getUserByEmail(data.email);
    if (existingEmail) {
      Alert.alert('Erro', 'Este e-mail ja esta cadastrado.');
      return;
    }

    // Check CPF uniqueness
    const existingCpf = await UserRepo.getUserByCpf(data.cpf);
    if (existingCpf) {
      Alert.alert('CPF ja cadastrado', 'Ja existe uma conta com este CPF. Faca login ou use outro CPF.');
      return;
    }

    const userId = generateId('user');
    const studentId = generateId('stud');
    const passwordHash = simpleHash(data.password);

    const newStudent: Student = {
      id: studentId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      birthDate: data.birthDate,
    };

    // Create student FIRST (before user) to satisfy foreign key constraint
    await StudentRepo.addStudent(newStudent);

    await UserRepo.createUser({
      id: userId,
      email: data.email,
      password_hash: passwordHash,
      role: 'student',
      student_id: studentId,
      instructor_id: null,
    });

    setCurrentUserId(userId);
    setCurrentStudent(newStudent);
    setStudents(prev => [...prev, newStudent]);
    setSavedAddresses([]);
    setFavoriteInstructorIds([]);
    setUserRoleState('student');
    setSignupStage('idle');
    setShowTutorial(true);

    await SettingsRepo.setSetting('currentUserId', userId);
    await SettingsRepo.setSetting('userRole', 'student');
  }, []);

  // New: signup instructor directly (role already chosen)
  const signupInstructor = useCallback(async (data: InstructorSignupData) => {
    // Check email uniqueness
    const existingEmail = await UserRepo.getUserByEmail(data.email);
    if (existingEmail) {
      Alert.alert('Erro', 'Este e-mail ja esta cadastrado.');
      return;
    }

    // Check CPF uniqueness
    const existingCpf = await UserRepo.getUserByCpf(data.cpf);
    if (existingCpf) {
      Alert.alert('CPF ja cadastrado', 'Ja existe uma conta com este CPF. Faca login ou use outro CPF.');
      return;
    }

    const userId = generateId('user');
    const instructorId = generateId('inst');
    const passwordHash = simpleHash(data.password);

    const price = parseFloat(data.pricePerHour.replace(',', '.')) || 0;

    const newInstructor: Instructor = {
      id: instructorId,
      name: data.name,
      car: `${data.brand} ${data.carModel}`,
      carImage: '',
      vehicleType: data.vehicleType || 'Carro',
      rating: 0,
      pricePerHour: price,
      transmission: data.transmission,
      bio: data.experienceText || '',
      reviews: [],
      availability: [],
      profileImage: '',
      coverImage: '',
      specialties: [],
      isAvailable: false,
      location: data.city,
      coordinates: { latitude: 0, longitude: 0 },
    };

    // Create instructor FIRST (before user) to satisfy foreign key constraint
    await InstructorRepo.addInstructor(newInstructor);

    await UserRepo.createUser({
      id: userId,
      email: data.email,
      password_hash: passwordHash,
      role: 'instructor',
      student_id: null,
      instructor_id: instructorId,
    });

    setCurrentUserId(userId);
    setCurrentInstructor(newInstructor);
    setInstructors(prev => [...prev, newInstructor]);
    setUserRoleState('instructor');
    setSignupStage('idle');
    setShowTutorial(true);

    await SettingsRepo.setSetting('currentUserId', userId);
    await SettingsRepo.setSetting('userRole', 'instructor');

    Alert.alert(
      'Cadastro enviado!',
      'Seus documentos serao analisados. Voce recebera um retorno em ate 48 horas.'
    );
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = await UserRepo.getUserByEmail(email);
    if (!user) return false;

    if (user.password_hash !== simpleHash(password)) return false;

    setCurrentUserId(user.id);
    await SettingsRepo.setSetting('currentUserId', user.id);

    if (user.role === 'student' && user.student_id) {
      const student = await StudentRepo.getStudentById(user.student_id);
      if (student) {
        setCurrentStudent(student);
        const [studentAddresses, favIds] = await Promise.all([
          AddressRepo.getSavedAddressesByStudent(student.id),
          FavoriteRepo.getFavoriteInstructorIds(student.id),
        ]);
        setSavedAddresses(studentAddresses);
        setFavoriteInstructorIds(favIds);
      }
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

    // Check tutorial flag
    const hasSeen = await SettingsRepo.getSetting(`hasSeenTutorial_${user.id}`);
    if (!hasSeen) {
      setShowTutorial(true);
    }

    return true;
  }, []);

  const completeTutorial = useCallback(async () => {
    setShowTutorial(false);
    if (currentUserId) {
      await SettingsRepo.setSetting(`hasSeenTutorial_${currentUserId}`, 'true');
    }
  }, [currentUserId]);

  const logout = useCallback(() => {
    setUserRoleState(null);
    setCurrentUserId(null);
    setSignupStage('idle');
    setPendingSignupData(null);
    setCurrentStudent({ id: '', name: '' });
    setCurrentInstructor(null);
    setSavedAddresses([]);
    setFavoriteInstructorIds([]);
    setShowTutorial(false);
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

    // Create student FIRST (before updating user FK) to satisfy foreign key constraint
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
      vehicleType: 'Carro',
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

    // Create instructor FIRST (before updating user FK) to satisfy foreign key constraint
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

  const updateAppointmentStatus = useCallback((id: string, status: 'Aceita' | 'Recusada' | 'Cancelada') => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );
    AppointmentRepo.updateAppointmentStatus(id, status).catch(console.error);
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    updateAppointmentStatus(id, 'Cancelada');
  }, [updateAppointmentStatus]);

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
    AddressRepo.addSavedAddress(newAddress, currentStudent.id).catch(console.error);
  }, [currentStudent.id]);

  const removeSavedAddress = useCallback((id: string) => {
    setSavedAddresses((prev) => prev.filter((addr) => addr.id !== id));
    AddressRepo.removeSavedAddress(id).catch(console.error);
  }, []);

  const value = {
    isLoading,
    userRole,
    signupStage,
    showTutorial,
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
    signupStudent,
    signupInstructor,
    login,
    logout,
    completeTutorial,
    completeStudentProfile,
    completeInstructorProfile,
    addAppointment,
    updateAppointmentStatus,
    cancelAppointment,
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
