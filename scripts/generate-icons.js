const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'assets', 'images');
const constantsDir = path.join(__dirname, '..', 'constants');

// ============================================================
// Read and parse original SVG logo
// ============================================================
const svgContent = fs.readFileSync(path.join(outputDir, '15117491.svg'), 'utf-8');

const pathRegex = /<path\s+d="([\s\S]*?)"\s*\/>/g;
const allPaths = [];
let match;
while ((match = pathRegex.exec(svgContent)) !== null) {
  allPaths.push(match[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim());
}

// Separate car paths from text paths by internal Y coordinate
// Y >= 1400 in internal coords = car illustration (display y ≈ 60-165)
// Y < 1400 = "Habilitar+" text (display y ≈ 188-223)
const carPaths = [];
const textPaths = [];
allPaths.forEach(d => {
  const m = d.match(/^M\s*(\d+)\s+(\d+)/);
  if (m) {
    (parseInt(m[2]) >= 1400 ? carPaths : textPaths).push(d);
  }
});

console.log(`Parsed SVG: ${allPaths.length} paths (${carPaths.length} car, ${textPaths.length} text)\n`);

// Original SVG internal transform: maps internal coords to 485x303 viewBox
const INNER = 'translate(0,303) scale(0.1,-0.1)';

// Display bounds (after inner transform):
// Car:  x≈[120,380] y≈[65,175]  center=(250, 120) size≈(260, 110)
// Text: x≈[136,400] y≈[188,223]
// Full: x≈[120,400] y≈[65,223]  center=(260, 144) size≈(280, 158)

function renderPaths(paths) {
  return paths.map(d => `      <path d="${d}"/>`).join('\n');
}

// ============================================================
// 1. App Icon (1024x1024) - blue circle + white car + green "+"
// Car center (250,120) → canvas (512, 480). Scale: 750/260 ≈ 2.88
// ============================================================
const iconSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1E40AF"/>
    </linearGradient>
  </defs>
  <circle cx="512" cy="512" r="490" fill="url(#bg)"/>
  <g transform="translate(-208, 134.4) scale(2.88)">
    <g transform="${INNER}" fill="white" stroke="none">
${renderPaths(carPaths)}
    </g>
  </g>
  <g transform="translate(710, 100)">
    <circle cx="105" cy="105" r="108" fill="white" opacity="0.2"/>
    <circle cx="105" cy="105" r="100" fill="#10B981"/>
    <line x1="105" y1="60" x2="105" y2="150" stroke="white" stroke-width="26" stroke-linecap="round"/>
    <line x1="60" y1="105" x2="150" y2="105" stroke="white" stroke-width="26" stroke-linecap="round"/>
  </g>
</svg>`;

// ============================================================
// 2. Adaptive Icon (1024x1024) - smaller car within safe zone
// Car center (250,120) → canvas (512, 490). Scale: 600/260 ≈ 2.3
// ============================================================
const adaptiveIconSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1E40AF"/>
    </linearGradient>
  </defs>
  <circle cx="512" cy="512" r="490" fill="url(#bg)"/>
  <g transform="translate(-63, 214) scale(2.3)">
    <g transform="${INNER}" fill="white" stroke="none">
${renderPaths(carPaths)}
    </g>
  </g>
  <g transform="translate(680, 140)">
    <circle cx="85" cy="85" r="88" fill="white" opacity="0.2"/>
    <circle cx="85" cy="85" r="82" fill="#10B981"/>
    <line x1="85" y1="48" x2="85" y2="122" stroke="white" stroke-width="20" stroke-linecap="round"/>
    <line x1="48" y1="85" x2="122" y2="85" stroke="white" stroke-width="20" stroke-linecap="round"/>
  </g>
</svg>`;

// ============================================================
// 3. Splash Icon (600x700) - car icon + text for iOS
// Car only, centered higher. Text as real <text> elements below.
// Car center (250,120) → canvas (300, 210). Scale: 520/260 = 2.0
// ============================================================
const splashCarS = 2.0;
const splashCarTX = 300 - 250 * splashCarS;  // -200
const splashCarTY = 210 - 120 * splashCarS;  // -30

const splashIconSvg = `<svg width="600" height="700" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
  <circle cx="300" cy="200" r="180" fill="white" opacity="0.05"/>
  <g transform="translate(${splashCarTX}, ${splashCarTY}) scale(${splashCarS})">
    <g transform="${INNER}" fill="white" stroke="none">
${renderPaths(carPaths)}
    </g>
  </g>
  <text x="300" y="400" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="56" fill="white" text-anchor="middle" letter-spacing="2">Habilitar+</text>
  <text x="300" y="450" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="22" fill="white" text-anchor="middle" letter-spacing="6">AUTOESCOLA DIGITAL</text>
</svg>`;

// ============================================================
// 4. Splash Android Icon (288x288) - transparent bg, for Android 12+
// Car only + text as real <text> elements.
// Car center (250,120) → canvas (144, 95). Scale: 0.95
// ============================================================
const androidCarS = 0.95;
const androidCarTX = 144 - 250 * androidCarS;  // -93.5
const androidCarTY = 95 - 120 * androidCarS;    // -19

const splashAndroidIconSvg = `<svg width="288" height="288" viewBox="0 0 288 288" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${androidCarTX}, ${androidCarTY}) scale(${androidCarS})">
    <g transform="${INNER}" fill="white" stroke="none">
${renderPaths(carPaths)}
    </g>
  </g>
  <text x="144" y="195" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="32" fill="white" text-anchor="middle" letter-spacing="1">Habilitar+</text>
  <text x="144" y="222" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="13" fill="white" text-anchor="middle" letter-spacing="3">AUTOESCOLA DIGITAL</text>
</svg>`;

// ============================================================
// Generate constants/logoPaths.ts for React Native components
// ============================================================
function generateConstants() {
  const esc = d => d.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const content = `// Auto-generated from assets/images/15117491.svg
// Run: node scripts/generate-icons.js

export const CAR_PATHS: string[] = [
${carPaths.map(d => `  '${esc(d)}'`).join(',\n')}
];

export const TEXT_PATHS: string[] = [
${textPaths.map(d => `  '${esc(d)}'`).join(',\n')}
];

export const SVG_INNER_TRANSFORM = '${INNER}';

// Bounding boxes in display coordinates (after inner transform)
export const CAR_BOUNDS = { x: 120, y: 65, width: 260, height: 110 };
export const FULL_LOGO_BOUNDS = { x: 120, y: 65, width: 280, height: 160 };
`;

  fs.writeFileSync(path.join(constantsDir, 'logoPaths.ts'), content);
  console.log('✓ constants/logoPaths.ts');
}

// ============================================================
// Generate all icon PNGs
// ============================================================
async function generateIcons() {
  console.log('Generating icons from original SVG...\n');

  generateConstants();

  await sharp(Buffer.from(iconSvg)).resize(1024, 1024).png().toFile(path.join(outputDir, 'icon.png'));
  console.log('✓ icon.png (1024x1024)');

  await sharp(Buffer.from(adaptiveIconSvg)).resize(1024, 1024).png().toFile(path.join(outputDir, 'adaptive-icon.png'));
  console.log('✓ adaptive-icon.png (1024x1024)');

  await sharp(Buffer.from(iconSvg)).resize(48, 48).png().toFile(path.join(outputDir, 'favicon.png'));
  console.log('✓ favicon.png (48x48)');

  await sharp(Buffer.from(splashAndroidIconSvg)).resize(288, 288).png().toFile(path.join(outputDir, 'splash-icon.png'));
  console.log('✓ splash-icon.png (288x288)');

  // Full splash: compose logo on gradient background
  const splashW = 1284, splashH = 2778;
  const logoW = 600, logoH = 700;
  const logoBuf = await sharp(Buffer.from(splashIconSvg)).resize(logoW, logoH).png().toBuffer();

  const bgSvg = `<svg width="${splashW}" height="${splashH}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1E40AF"/>
    </linearGradient></defs>
    <rect width="${splashW}" height="${splashH}" fill="url(#g)"/>
  </svg>`;
  const bgBuf = await sharp(Buffer.from(bgSvg)).resize(splashW, splashH).png().toBuffer();

  await sharp(bgBuf)
    .composite([{
      input: logoBuf,
      left: Math.round((splashW - logoW) / 2),
      top: Math.round((splashH - logoH) / 2) - 150
    }])
    .png()
    .toFile(path.join(outputDir, 'splash.png'));
  console.log('✓ splash.png (1284x2778)');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
