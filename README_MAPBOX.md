# 🗺️ Configuração do Mapbox

Este projeto usa **Mapbox** para exibir o mapa interativo com marcadores de preços dos instrutores.

## Por que Mapbox?

- ✅ **Estilo customizável** - Design minimalista e clean
- ✅ **Marcadores customizados** - Preços visíveis diretamente no mapa
- ✅ **Performance superior** - Renderização fluida e rápida
- ✅ **Free tier generoso** - Até 50.000 visualizações/mês grátis
- ✅ **Alternativa ao Google Maps** - Sem necessidade de billing obrigatório

## 🚀 Como Configurar

### Passo 1: Criar Conta no Mapbox

1. Acesse [mapbox.com](https://www.mapbox.com/)
2. Clique em **Sign Up** e crie uma conta gratuita
3. Confirme seu email

### Passo 2: Obter o Access Token

1. Após login, vá para [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/)
2. Você verá um **Default public token** já criado
3. Copie este token (começa com `pk.eyJ...`)

**Exemplo de token:**
```
pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example-token-here
```

### Passo 3: Configurar no App

Abra o arquivo **`constants/MapboxConfig.ts`** e substitua `SEU_TOKEN_AQUI` pelo token copiado:

```typescript
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
```

### Passo 4: Rebuild do App

Como adicionamos uma dependência nativa, é necessário fazer rebuild:

```bash
# Parar o servidor atual (Ctrl+C)
npm run android
# ou
npm run ios
```

## 📱 Testando

Após configurar o token:

1. Abra o app
2. Navegue para a tela de busca de instrutores
3. Você verá o mapa com:
   - **Estilo minimalista** (fundo claro, ruas brancas)
   - **Marcadores customizados** mostrando preços (ex: "R$ 80")
   - **Pins azuis** que ficam vermelhos ao selecionar

## 🎨 Estilos de Mapa Disponíveis

Você pode trocar o estilo do mapa editando [InstructorMapbox.tsx](components/InstructorMapbox.tsx):

```typescript
<MapView
  styleURL="mapbox://styles/mapbox/light-v11" // ← Troque aqui
  // ...
>
```

**Opções de estilos:**

| Estilo | URL | Descrição |
|--------|-----|-----------|
| Light | `mapbox://styles/mapbox/light-v11` | Minimalista claro (atual) |
| Dark | `mapbox://styles/mapbox/dark-v11` | Tema escuro |
| Streets | `mapbox://styles/mapbox/streets-v12` | Detalhado com nomes |
| Outdoors | `mapbox://styles/mapbox/outdoors-v12` | Relevo e natureza |
| Satellite | `mapbox://styles/mapbox/satellite-v9` | Imagem de satélite |

## 🔒 Segurança

✅ **Tokens públicos são seguros** - O token `pk.*` pode ser commitado no código
⚠️ **NUNCA commite tokens secretos** - Tokens `sk.*` devem ficar em `.env`

## ❓ Problemas Comuns

### Mapa não aparece (tela branca)
- Verifique se configurou o token corretamente
- Certifique-se de ter feito rebuild do app (`npm run android/ios`)
- Veja os logs de erro: pode ter erro de token inválido

### Token inválido
- Verifique se copiou o token completo (inicia com `pk.`)
- Certifique-se de não ter espaços extras no arquivo
- Gere um novo token se necessário

### Marcadores não aparecem
- Verifique se os instrutores têm coordenadas válidas no `AuthContext`
- Os marcadores só aparecem para instrutores com `coordinates` definidos

## 📚 Documentação Oficial

- [Mapbox React Native](https://github.com/rnmapbox/maps)
- [Mapbox Styles](https://docs.mapbox.com/api/maps/styles/)
- [Mapbox Pricing](https://www.mapbox.com/pricing)

## 💡 Customização

Você pode customizar os marcadores editando os estilos em [InstructorMapbox.tsx](components/InstructorMapbox.tsx):

- **Cores**: Troque `Colors.light.*` por outras cores
- **Tamanho**: Ajuste `paddingHorizontal`, `paddingVertical`
- **Fonte**: Mude `fontSize` e `fontWeight`
- **Pin vertical**: Remova ou ajuste height do `styles.pin`

---

**Pronto!** 🎉 O mapa estará funcionando com marcadores de preços personalizados.
