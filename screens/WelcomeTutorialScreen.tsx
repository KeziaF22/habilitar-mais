import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Calendar, User, Wallet, Home, Star, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AppCarIcon from '@/components/AppCarIcon';

const { width } = Dimensions.get('window');

type TutorialPage = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const studentPages: TutorialPage[] = [
  {
    id: '1',
    title: 'Busque Instrutores',
    description:
      'Encontre instrutores qualificados perto de voce. Filtre por nome, bairro, tipo de veiculo e transmissao.',
    icon: <Search size={64} color="#FFFFFF" strokeWidth={1.5} />,
  },
  {
    id: '2',
    title: 'Agende suas Aulas',
    description:
      'Escolha o melhor horario e local para suas aulas. Acompanhe o status dos seus agendamentos em tempo real.',
    icon: <Calendar size={64} color="#FFFFFF" strokeWidth={1.5} />,
  },
  {
    id: '3',
    title: 'Gerencie seu Perfil',
    description:
      'Salve instrutores favoritos, adicione enderecos e acompanhe todo o seu historico de aulas.',
    icon: <User size={64} color="#FFFFFF" strokeWidth={1.5} />,
  },
];

const instructorPages: TutorialPage[] = [
  {
    id: '1',
    title: 'Gerencie suas Aulas',
    description:
      'Visualize sua agenda e gerencie solicitacoes de aulas. Aceite ou recuse agendamentos com facilidade.',
    icon: <Calendar size={64} color="#FFFFFF" strokeWidth={1.5} />,
  },
  {
    id: '2',
    title: 'Acompanhe seus Ganhos',
    description:
      'Veja seus ganhos detalhados na carteira. Acompanhe o historico de pagamentos e saldo disponivel.',
    icon: <Wallet size={64} color="#FFFFFF" strokeWidth={1.5} />,
  },
  {
    id: '3',
    title: 'Seu Perfil Profissional',
    description:
      'Mantenha seu perfil atualizado para atrair mais alunos. Gerencie avaliacoes e informacoes do veiculo.',
    icon: <Star size={64} color="#FFFFFF" strokeWidth={1.5} />,
  },
];

interface WelcomeTutorialScreenProps {
  role: 'student' | 'instructor';
  onComplete: () => void;
}

export default function WelcomeTutorialScreen({ role, onComplete }: WelcomeTutorialScreenProps) {
  const pages = role === 'student' ? studentPages : instructorPages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToNext = () => {
    if (currentIndex < pages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      onComplete();
    }
  };

  const isLastPage = currentIndex === pages.length - 1;

  const renderPage = ({ item }: { item: TutorialPage }) => (
    <View style={styles.page}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={styles.pageTitle}>{item.title}</Text>
      <Text style={styles.pageDescription}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.primaryDark, '#1D4ED8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header with Skip button */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <AppCarIcon size={28} useGradient={false} color="#FFFFFF" showPlus />
          <Text style={styles.logoText}>Habilitar+</Text>
        </View>
        <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome title */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          {role === 'student' ? 'Bem-vindo, Aluno!' : 'Bem-vindo, Instrutor!'}
        </Text>
        <Text style={styles.welcomeSubtitle}>Veja como usar o app</Text>
      </View>

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />

      {/* Dots + Button */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Action button */}
        <TouchableOpacity style={styles.actionButton} onPress={goToNext} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>
            {isLastPage ? 'Comecar' : 'Proximo'}
          </Text>
          {!isLastPage && <ChevronRight size={20} color={Colors.light.primary} />}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  welcomeSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  flatList: {
    flex: 1,
  },
  page: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 28,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});
