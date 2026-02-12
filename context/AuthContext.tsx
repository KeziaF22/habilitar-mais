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
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  status: 'Pendente' | 'Aceita' | 'Recusada';
  price: number;
  address?: string;
  paymentMethod?: PaymentMethod;
  serviceFee?: number;
  discount?: number;
  totalPrice?: number;
};

// --- Context Definition ---
export type UserRole = 'student' | 'instructor' | null;

interface AuthContextType {
  isLoading: boolean;
  userRole: UserRole;
  currentStudent: Student;
  currentInstructor: Instructor | null;
  students: Student[];
  instructors: Instructor[];
  appointments: Appointment[];
  locations: string[];
  savedAddresses: SavedAddress[];
  favoriteInstructorIds: string[];
  setUserRole: (role: UserRole) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: 'Aceita' | 'Recusada') => void;
  toggleFavorite: (instructorId: string) => void;
  updateStudentInfo: (updates: Partial<Student>) => void;
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
        // Initialize DB schema and seed
        const db = await getDatabase();
        await initializeSchema(db);
        await seedDatabase(db);

        // Load all data in parallel
        const [
          dbInstructors,
          dbStudents,
          dbAppointments,
          dbAddresses,
          dbLocations,
          dbRole,
        ] = await Promise.all([
          InstructorRepo.getAllInstructors(),
          StudentRepo.getAllStudents(),
          AppointmentRepo.getAllAppointments(),
          AddressRepo.getAllSavedAddresses(),
          LocationRepo.getAllLocations(),
          SettingsRepo.getSetting('userRole'),
        ]);

        if (!mounted) return;

        setInstructors(dbInstructors);
        setStudents(dbStudents);
        setAppointments(dbAppointments);
        setSavedAddresses(dbAddresses);
        setLocations(dbLocations);

        if (dbStudents.length > 0) setCurrentStudent(dbStudents[0]);
        if (dbInstructors.length > 0) setCurrentInstructor(dbInstructors[0]);

        if (dbRole === 'student' || dbRole === 'instructor') {
          setUserRoleState(dbRole);
        }

        // Load favorites for current student
        if (dbStudents.length > 0) {
          const favIds = await FavoriteRepo.getFavoriteInstructorIds(dbStudents[0].id);
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
    StudentRepo.updateStudent(currentStudent.id, updates).catch(console.error);
  }, [currentStudent.id]);

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
    currentStudent,
    currentInstructor,
    students,
    instructors,
    appointments,
    locations,
    savedAddresses,
    favoriteInstructorIds,
    setUserRole,
    addAppointment,
    updateAppointmentStatus,
    toggleFavorite,
    updateStudentInfo,
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
