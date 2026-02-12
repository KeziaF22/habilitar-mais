import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Search, Calendar, Heart, User, Home, Wallet } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import StudentHomeScreen from '@/screens/student/StudentHomeScreen';
import InstructorDetailScreen from '@/screens/student/InstructorDetailScreen';
import StudentCheckoutScreen from '@/screens/student/StudentCheckoutScreen';
import MyClassesScreen from '@/screens/student/MyClassesScreen';
import FavoritesScreen from '@/screens/student/FavoritesScreen';
import ProfileScreen from '@/screens/student/ProfileScreen';
import InstructorHomeScreen from '@/screens/instructor/InstructorHomeScreen';
import InstructorSignupScreen from '@/screens/instructor/InstructorSignupScreen';
import InstructorAgendaScreen from '@/screens/instructor/InstructorAgendaScreen';
import InstructorWalletScreen from '@/screens/instructor/InstructorWalletScreen';
import InstructorProfileScreen from '@/screens/instructor/InstructorProfileScreen';
import { InstructorStackParamList, StudentStackParamList, StudentTabParamList, InstructorTabParamList } from '@/navigation/types';

enableScreens();

const StudentStack = createNativeStackNavigator<StudentStackParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const InstructorTab = createBottomTabNavigator<InstructorTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
  },
};

function StudentStackNavigator() {
  return (
    <StudentStack.Navigator>
      <StudentStack.Screen
        name="StudentHome"
        component={StudentHomeScreen}
        options={{ headerShown: false }}
      />
      <StudentStack.Screen
        name="InstructorDetail"
        component={InstructorDetailScreen}
        options={{
          title: 'Detalhes do Instrutor',
          headerStyle: { backgroundColor: Colors.light.primary },
          headerTintColor: Colors.light.surface,
        }}
      />
      <StudentStack.Screen
        name="StudentCheckout"
        component={StudentCheckoutScreen}
        options={{
          title: 'Confirmar Reserva',
          headerStyle: { backgroundColor: Colors.light.primary },
          headerTintColor: Colors.light.surface,
        }}
      />
    </StudentStack.Navigator>
  );
}

function StudentTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <StudentTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 64 + (insets.bottom > 0 ? insets.bottom : 0),
          elevation: 8,
          shadowColor: Colors.light.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <StudentTab.Screen
        name="BuscarTab"
        component={StudentStackNavigator}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <StudentTab.Screen
        name="MinhasAulas"
        component={MyClassesScreen}
        options={{
          tabBarLabel: 'Aulas',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <StudentTab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <StudentTab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </StudentTab.Navigator>
  );
}

function InstructorTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <InstructorTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 64 + (insets.bottom > 0 ? insets.bottom : 0),
          elevation: 8,
          shadowColor: Colors.light.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <InstructorTab.Screen
        name="Inicio"
        component={InstructorHomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <InstructorTab.Screen
        name="Agenda"
        component={InstructorAgendaScreen}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <InstructorTab.Screen
        name="Carteira"
        component={InstructorWalletScreen}
        options={{
          tabBarLabel: 'Carteira',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
        }}
      />
      <InstructorTab.Screen
        name="PerfilInstrutor"
        component={InstructorProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </InstructorTab.Navigator>
  );
}

type AuthScreen = 'login' | 'signup' | 'onboarding';

function RootNavigator() {
  const { userRole, isLoading, updateStudentInfo, currentStudent } = useAuth();
  const [authScreen, setAuthScreen] = React.useState<AuthScreen>('login');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light.background }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!userRole) {
    if (authScreen === 'signup') {
      return (
        <SignupScreen
          onSignupComplete={(data) => {
            updateStudentInfo({ name: data.name, email: data.email, phone: data.phone });
            setAuthScreen('onboarding');
          }}
          onBackToLogin={() => setAuthScreen('login')}
        />
      );
    }

    if (authScreen === 'onboarding') {
      return <OnboardingScreen />;
    }

    return (
      <LoginScreen
        onSignup={() => setAuthScreen('signup')}
      />
    );
  }

  return userRole === 'student' ? <StudentTabNavigator /> : <InstructorTabNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
