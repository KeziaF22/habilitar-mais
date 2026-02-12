export type StudentStackParamList = {
  StudentHome: undefined;
  InstructorDetail: { id: string };
  StudentCheckout: { instructorId: string };
};

export type StudentTabParamList = {
  BuscarTab: undefined;
  MinhasAulas: undefined;
  Favoritos: undefined;
  Perfil: undefined;
};

export type InstructorStackParamList = {
  InstructorDashboard: undefined;
  InstructorAgenda: undefined;
};

export type InstructorTabParamList = {
  Inicio: undefined;
  Agenda: undefined;
  Carteira: undefined;
  PerfilInstrutor: undefined;
};
