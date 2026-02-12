// Configuração do Mapbox
//
// IMPORTANTE: Obtenha seu próprio token em https://account.mapbox.com/access-tokens/
//
// Como configurar:
// 1. Crie uma conta grátis em https://www.mapbox.com/
// 2. Vá para https://account.mapbox.com/access-tokens/
// 3. Copie o "Default public token" ou crie um novo token público
// 4. Cole o token abaixo substituindo 'SEU_TOKEN_AQUI'
//
// NOTA: O token público é seguro para ser commitado (mas crie scopes limitados)
// Tokens secretos NUNCA devem ser commitados

// IMPORTANTE: Obtenha seu próprio token gratuito em https://account.mapbox.com/access-tokens/
// Configure o token no arquivo .env com a variável EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  'SEU_TOKEN_AQUI'; // Fallback - substitua ou use .env
