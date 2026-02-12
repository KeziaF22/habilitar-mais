import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// --- Mock Data (Manaus, AM) ---
const mockInstructors: Instructor[] = [
  {
    id: 'inst1',
    name: 'Carlos Santos',
    car: 'Honda City',
    carImage: 'https://via.placeholder.com/150/2962FF/FFFFFF?text=Honda+City',
    rating: 4.8,
    pricePerHour: 80.0,
    transmission: 'Auto',
    bio: 'Instrutor experiente com foco em direção defensiva e segurança.',
    reviews: [
      { student: 'João Paulo', comment: 'Ótimo instrutor! Muito paciente.', rating: 5 },
      { student: 'Maria Silva', comment: 'Me ajudou muito a perder o medo.', rating: 4 },
    ],
    availability: [
      { day: 'Seg', time: '09:00' },
      { day: 'Seg', time: '10:00' },
      { day: 'Ter', time: '14:00' },
      { day: 'Ter', time: '15:00' },
    ],
    profileImage: 'https://ui-avatars.com/api/?name=Carlos+Santos&background=2962FF&color=fff&size=200',
    coverImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=300&fit=crop',
    specialties: ['Direção Defensiva', 'Estacionamento', 'Baliza'],
    isAvailable: true,
    location: 'Jardins',
    coordinates: {
      latitude: -3.1150,
      longitude: -60.0250,
    },
  },
  {
    id: 'inst2',
    name: 'Ana Costa',
    car: 'Hyundai HB20',
    carImage: 'https://via.placeholder.com/150/00C853/FFFFFF?text=Hyundai+HB20',
    rating: 4.9,
    pricePerHour: 75.0,
    transmission: 'Manual',
    bio: 'Especialista em baliza e direção em trânsito intenso. Habilitada para ensinar.',
    reviews: [
      { student: 'Pedro Lima', comment: 'A Ana é super didática, recomendo!', rating: 5 },
      { student: 'Bruna Alves', comment: 'Pontual e muito atenciosa.', rating: 5 },
    ],
    availability: [
      { day: 'Qua', time: '08:00' },
      { day: 'Qua', time: '09:00' },
      { day: 'Qui', time: '16:00' },
      { day: 'Qui', time: '17:00' },
    ],
    profileImage: 'https://ui-avatars.com/api/?name=Ana+Costa&background=00C853&color=fff&size=200',
    coverImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=300&fit=crop',
    specialties: ['Baliza', 'Trânsito Intenso', 'Câmbio Manual', 'Direção Urbana'],
    isAvailable: false,
    location: 'Centro',
    coordinates: {
      latitude: -3.1300,
      longitude: -60.0200,
    },
  },
  {
    id: 'inst3',
    name: 'Marcos Oliveira',
    car: 'Chevrolet Onix',
    carImage: 'https://via.placeholder.com/150/2962FF/FFFFFF?text=Chevrolet+Onix',
    rating: 4.7,
    pricePerHour: 85.0,
    transmission: 'Auto',
    bio: 'Foco na praticidade e confiança do aluno ao volante.',
    reviews: [
      { student: 'Julia Mendes', comment: 'O Marcos me deu muita segurança.', rating: 4 },
      { student: 'Lucas Pereira', comment: 'Boa experiência de aprendizado.', rating: 5 },
    ],
    availability: [
      { day: 'Sex', time: '10:00' },
      { day: 'Sex', time: '11:00' },
      { day: 'Sab', time: '08:00' },
      { day: 'Sab', time: '09:00' },
    ],
    profileImage: 'https://ui-avatars.com/api/?name=Marcos+Oliveira&background=FFA000&color=fff&size=200',
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop',
    specialties: ['Primeira Habilitação', 'Confiança ao Volante', 'Rodovias'],
    isAvailable: true,
    location: 'Ponta Negra',
    coordinates: {
      latitude: -3.0800,
      longitude: -60.1100,
    },
  },
];

const mockStudents: Student[] = [
  { id: 'stud1', name: 'João Paulo', email: 'joao@email.com', phone: '(92) 99999-9999' },
  { id: 'stud2', name: 'Maria Silva', email: 'maria@email.com', phone: '(92) 98888-8888' },
  { id: 'stud3', name: 'Pedro Lima', email: 'pedro@email.com', phone: '(92) 97777-7777' },
];

const mockLocations = [
  'Ponta Negra, Manaus',
  'Vieiralves, Manaus',
  'Cidade Nova, Manaus',
  'Adrianópolis, Manaus',
  'Parque 10 de Novembro, Manaus',
];

const mockSavedAddresses: SavedAddress[] = [
  { id: 'addr1', label: 'Casa', street: 'Rua Ponta Negra, 123', neighborhood: 'Ponta Negra' },
  { id: 'addr2', label: 'Trabalho', street: 'Av. Djalma Batista, 456', neighborhood: 'Flores' },
];

// --- Context Definition ---
type UserRole = 'student' | 'instructor' | null;

interface AuthContextType {
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

// --- Auth Provider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student>(mockStudents[0]);
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(mockInstructors[0]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(mockSavedAddresses);
  const [favoriteInstructorIds, setFavoriteInstructorIds] = useState<string[]>([]);

  const addAppointment = (newAppointment: Omit<Appointment, 'id' | 'status'>) => {
    const appointmentWithId: Appointment = {
      ...newAppointment,
      id: `appt-${appointments.length + 1}`,
      status: 'Pendente',
    };
    setAppointments((prev) => [...prev, appointmentWithId]);
  };

  const updateAppointmentStatus = (id: string, status: 'Aceita' | 'Recusada') => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );
  };

  const toggleFavorite = (instructorId: string) => {
    setFavoriteInstructorIds((prev) => {
      if (prev.includes(instructorId)) {
        return prev.filter((id) => id !== instructorId);
      } else {
        return [...prev, instructorId];
      }
    });
  };

  const updateStudentInfo = (updates: Partial<Student>) => {
    setCurrentStudent((prev) => ({ ...prev, ...updates }));
  };

  const addSavedAddress = (address: Omit<SavedAddress, 'id'>) => {
    const newAddress: SavedAddress = {
      ...address,
      id: `addr-${savedAddresses.length + 1}`,
    };
    setSavedAddresses((prev) => [...prev, newAddress]);
  };

  const removeSavedAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const value = {
    userRole,
    currentStudent,
    currentInstructor,
    students: mockStudents,
    instructors: mockInstructors,
    appointments,
    locations: mockLocations,
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
