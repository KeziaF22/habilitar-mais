const HabilitarColors = {
  // 🚗 Paleta Automotiva Premium - Azul Vibrante
  // Cores mais claras e enérgicas, mantendo profissionalismo automotivo

  primary: '#2563EB',        // Azul Royal Vibrante - Principal (CTAs, botões primários)
  primaryLight: '#60A5FA',   // Azul Céu Claro - Hover states, variações
  primaryDark: '#1E40AF',    // Azul Royal Escuro - Textos de ênfase

  success: '#10B981',        // Verde Esmeralda - Ganhos, confirmações, status positivos
  successLight: '#D1FAE5',   // Verde Menta - Backgrounds de sucesso

  warning: '#F59E0B',        // Âmbar Sinalização - Alertas, atenção, pendências
  warningLight: '#FEF3C7',   // Amarelo Suave - Backgrounds de aviso

  error: '#EF4444',          // Vermelho Vivo - Erros, ações críticas
  errorLight: '#FEE2E2',     // Rosa Claro - Backgrounds de erro

  info: '#06B6D4',           // Ciano Tecnológico - Dicas, informações neutras
  infoLight: '#CFFAFE',      // Ciano Claro - Backgrounds informativos

  // Superfícies e Fundos
  background: '#F9FAFB',     // Cinza Muito Claro - Fundo geral das telas
  surface: '#FFFFFF',        // Branco Puro - Cards, containers elevados
  surfaceVariant: '#F3F4F6', // Cinza Claro - Alternativa para superfícies

  // Tipografia
  textPrimary: '#1F2937',    // Grafite Escuro - Textos principais
  textSecondary: '#6B7280',  // Cinza Médio - Textos secundários, labels, hints
  textTertiary: '#9CA3AF',   // Cinza Claro - Textos desabilitados, placeholders

  // Bordas e Divisores
  border: '#E5E7EB',         // Prata Metálico - Bordas padrão
  borderLight: '#F3F4F6',    // Cinza Muito Claro - Divisores sutis

  // Sombras
  shadow: '#000000',         // Preto - Base para sombras (usar com opacity)

  // Aliases para compatibilidade e semântica
  brand: '#2563EB',          // = primary
  accent: '#10B981',         // = success
  brandContainer: '#60A5FA', // = primaryLight
  price: '#10B981',          // Verde para preços/ganhos

  // Cores legadas (manter para compatibilidade temporária)
  navy: '#2563EB',
  steel: '#60A5FA',
  sage: '#10B981',
  rose: '#EF4444',
  purple: '#6B7280',
  periwinkle: '#06B6D4',
};

export default {
  light: {
    ...HabilitarColors, // Spread all Habilitar+ colors for direct access
    text: HabilitarColors.textPrimary,
    tint: HabilitarColors.brand,
    tabIconDefault: HabilitarColors.textSecondary,
    tabIconSelected: HabilitarColors.brand,
  },
  dark: {
    ...HabilitarColors, // Spread all Habilitar+ colors for direct access
    text: HabilitarColors.surface,
    background: '#121212',
    tint: HabilitarColors.brand,
    tabIconDefault: HabilitarColors.textSecondary,
    tabIconSelected: HabilitarColors.brand,
  },
};
