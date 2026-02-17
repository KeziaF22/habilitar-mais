# Habilitar+

Aplicativo mobile para conectar alunos a instrutores de direcao veicular. Desenvolvido com React Native e Expo.

## Sobre o Projeto

O **Habilitar+** facilita o processo de encontrar e agendar aulas de direcao com instrutores qualificados. O app atende dois perfis de usuario:

- **Alunos** — Buscar instrutores por nome, bairro, tipo de veiculo e transmissao; agendar aulas; gerenciar favoritos, enderecos e historico.
- **Instrutores** — Gerenciar agenda de aulas; aceitar ou recusar solicitacoes; acompanhar ganhos na carteira; manter perfil profissional.

## Funcionalidades

### Aluno
- Busca de instrutores com filtros (transmissao, tipo de veiculo, preco, localizacao)
- Mapa interativo com localizacao dos instrutores (Mapbox)
- Agendamento de aulas com selecao de data, horario, endereco e pagamento
- Validacao de conflitos de horario (instrutor e aluno)
- Gerenciamento de enderecos salvos e instrutores favoritos
- Visualizacao de aulas agendadas com detalhes expandiveis
- Perfil com estatisticas de aulas

### Instrutor
- Dashboard com resumo de aulas e ganhos
- Agenda com solicitacoes pendentes (aceitar/recusar)
- Carteira com historico de pagamentos e saldo
- Perfil editavel (nome, bio, veiculo, especialidades)

### Geral
- Cadastro com validacao de CPF e campos obrigatorios
- Login com persistencia de sessao
- Redefinicao de senha
- Tutorial de boas-vindas apos primeiro acesso
- Suporte a tipos de veiculo: Carro, Moto, Caminhao, Onibus, Articulado (CNH A-E)

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [React Native](https://reactnative.dev/) | Framework mobile |
| [Expo SDK 54](https://expo.dev/) | Plataforma de desenvolvimento |
| [TypeScript](https://www.typescriptlang.org/) | Linguagem |
| [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Banco de dados local |
| [React Navigation](https://reactnavigation.org/) | Navegacao (Stack + Bottom Tabs) |
| [Mapbox](https://www.mapbox.com/) | Mapa interativo |
| [Lucide Icons](https://lucide.dev/) | Icones |
| [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | Gradientes |
| [date-fns](https://date-fns.org/) | Formatacao de datas |

## Estrutura do Projeto

```
habilitar-mais/
├── App.tsx                     # Ponto de entrada, navegacao e fluxo de autenticacao
├── context/
│   └── AuthContext.tsx          # Estado global (auth, dados, CRUD)
├── database/
│   ├── connection.ts            # Conexao SQLite singleton
│   ├── schema.ts                # Criacao de tabelas e migracoes (v1-v6)
│   ├── seed.ts                  # Dados iniciais para demonstracao
│   └── repositories/            # Camada de acesso a dados
│       ├── appointmentRepository.ts
│       ├── favoriteRepository.ts
│       ├── instructorRepository.ts
│       ├── savedAddressRepository.ts
│       ├── settingsRepository.ts
│       ├── studentRepository.ts
│       └── userRepository.ts
├── screens/
│   ├── LoginScreen.tsx          # Login + redefinicao de senha
│   ├── OnboardingScreen.tsx     # Selecao de perfil (aluno/instrutor)
│   ├── StudentSignupScreen.tsx  # Cadastro do aluno (5 etapas)
│   ├── WelcomeTutorialScreen.tsx # Tutorial pos-cadastro
│   ├── student/
│   │   ├── StudentHomeScreen.tsx      # Busca + mapa
│   │   ├── InstructorDetailScreen.tsx # Perfil do instrutor
│   │   ├── StudentCheckoutScreen.tsx  # Agendamento
│   │   ├── MyClassesScreen.tsx        # Minhas aulas
│   │   ├── FavoritesScreen.tsx        # Favoritos
│   │   └── ProfileScreen.tsx          # Perfil do aluno
│   └── instructor/
│       ├── InstructorHomeScreen.tsx    # Dashboard
│       ├── InstructorAgendaScreen.tsx  # Agenda
│       ├── InstructorWalletScreen.tsx  # Carteira
│       ├── InstructorProfileScreen.tsx # Perfil
│       └── InstructorSignupScreen.tsx  # Cadastro (5 etapas)
├── components/                  # Componentes reutilizaveis
├── constants/
│   └── Colors.ts                # Paleta de cores do app
├── navigation/
│   └── types.ts                 # Tipagens de navegacao
└── utils/
    ├── cpf.ts                   # Validacao de CPF
    └── hash.ts                  # Hash simples para senhas
```

## Pre-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para build Android)
- JDK 17 (para compilacao nativa)
- Token do [Mapbox](https://account.mapbox.com/access-tokens/) (gratuito)

## Instalacao

```bash
# Clonar o repositorio
git clone https://github.com/KeziaFrazao/habilitar-mais.git
cd habilitar-mais

# Instalar dependencias
npm install

# Configurar Mapbox
cp .env.example .env
# Edite .env e adicione seu EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
```

## Executando

```bash
# Modo desenvolvimento (Expo Go)
npx expo start

# Android (emulador ou dispositivo)
npx expo run:android

# iOS (somente macOS)
npx expo run:ios
```

## Gerando APK

```bash
cd android
JAVA_HOME="/caminho/para/jdk-17" ANDROID_HOME="/caminho/para/Android/Sdk" ./gradlew assembleRelease
```

O APK sera gerado em `android/app/build/outputs/apk/release/app-release.apk`.

## Contas de Demonstracao

O banco e populado automaticamente com dados de exemplo na primeira execucao:

| Perfil | Email | Senha |
|---|---|---|
| Aluno | joao@email.com | 123456 |
| Instrutor | instrutor@email.com | 123456 |

## Banco de Dados

O app usa SQLite local com sistema de migracoes versionado (atualmente v6). As tabelas sao:

- `instructors` — Dados dos instrutores
- `students` — Dados dos alunos
- `users` — Autenticacao (email, senha hash, role)
- `appointments` — Agendamentos de aulas
- `saved_addresses` — Enderecos salvos (por aluno)
- `favorites` — Instrutores favoritos (por aluno)
- `locations` — Localizacoes disponiveis
- `settings` — Configuracoes persistentes (sessao, tutorial)

## Licenca

Este projeto esta licenciado sob a [MIT License](LICENSE).
