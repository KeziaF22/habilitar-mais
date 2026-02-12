const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'assets', 'images');

// App icon SVG - Blue gradient circle with white car + green plus badge
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
    <clipPath id="speedClip">
      <rect x="0" y="0" width="1024" height="368"/>
      <rect x="0" y="410" width="1024" height="42"/>
      <rect x="0" y="492" width="1024" height="532"/>
    </clipPath>
  </defs>

  <!-- Background circle -->
  <circle cx="512" cy="512" r="490" fill="url(#bg)" />

  <!-- Car silhouette with speed line cutouts -->
  <g transform="translate(105, 205)">
    <!-- Car body -->
    <path
      d="M184 450 L225 307 C245 266 287 225 327 225 L553 225 C593 225 635 266 655 307 L716 409 L737 450 C737 471 716 491 696 491 L204 491 C184 491 163 471 184 450 Z"
      fill="white"
      clip-path="url(#speedClip)"
    />

    <!-- Windshield -->
    <path
      d="M368 230 L286 375 L594 375 L552 230 Z"
      fill="white"
      opacity="0.4"
      clip-path="url(#speedClip)"
    />

    <!-- Speed lines -->
    <line x1="40" y1="307" x2="225" y2="307" stroke="white" stroke-width="46" stroke-linecap="round" />
    <line x1="82" y1="389" x2="266" y2="389" stroke="white" stroke-width="46" stroke-linecap="round" />

    <!-- Front wheel -->
    <circle cx="614" cy="501" r="92" fill="white" />

    <!-- Rear wheel -->
    <circle cx="307" cy="501" r="92" fill="white" />
  </g>

  <!-- Plus badge -->
  <g transform="translate(680, 82)">
    <circle cx="120" cy="120" r="120" fill="#10B981" />
    <circle cx="120" cy="120" r="110" fill="#10B981" />
    <line x1="120" y1="65" x2="120" y2="175" stroke="white" stroke-width="32" stroke-linecap="round" />
    <line x1="65" y1="120" x2="175" y2="120" stroke="white" stroke-width="32" stroke-linecap="round" />
  </g>
</svg>
`;

// Adaptive icon foreground - same car but centered for Android safe zone
const adaptiveIconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
    <clipPath id="speedClip2">
      <rect x="0" y="0" width="1024" height="368"/>
      <rect x="0" y="410" width="1024" height="42"/>
      <rect x="0" y="492" width="1024" height="532"/>
    </clipPath>
  </defs>

  <!-- Background - transparent, Android will add shape -->
  <circle cx="512" cy="512" r="490" fill="url(#bg)" />

  <!-- Car silhouette - slightly smaller and more centered -->
  <g transform="translate(145, 225)">
    <path
      d="M160 390 L195 267 C212 231 250 195 284 195 L480 195 C515 195 553 231 570 267 L623 355 L641 390 C641 408 623 426 605 426 L178 426 C160 426 142 408 160 390 Z"
      fill="white"
      clip-path="url(#speedClip2)"
    />

    <!-- Windshield -->
    <path
      d="M320 200 L250 325 L516 325 L480 200 Z"
      fill="white"
      opacity="0.4"
      clip-path="url(#speedClip2)"
    />

    <!-- Speed lines -->
    <line x1="35" y1="267" x2="195" y2="267" stroke="white" stroke-width="40" stroke-linecap="round" />
    <line x1="70" y1="338" x2="231" y2="338" stroke="white" stroke-width="40" stroke-linecap="round" />

    <!-- Front wheel -->
    <circle cx="534" cy="435" r="80" fill="white" />

    <!-- Rear wheel -->
    <circle cx="267" cy="435" r="80" fill="white" />
  </g>

  <!-- Plus badge -->
  <g transform="translate(660, 115)">
    <circle cx="100" cy="100" r="100" fill="#10B981" />
    <line x1="100" y1="55" x2="100" y2="145" stroke="white" stroke-width="26" stroke-linecap="round" />
    <line x1="55" y1="100" x2="145" y2="100" stroke="white" stroke-width="26" stroke-linecap="round" />
  </g>
</svg>
`;

// Splash icon SVG (just the white car + badge, no background, rendered at 600x600)
const splashIconSvg = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="splashClip">
      <rect x="0" y="0" width="600" height="215"/>
      <rect x="0" y="240" width="600" height="25"/>
      <rect x="0" y="288" width="600" height="312"/>
    </clipPath>
  </defs>

  <!-- Subtle white circle glow -->
  <circle cx="280" cy="320" r="260" fill="white" opacity="0.1" />

  <!-- Car silhouette -->
  <g transform="translate(30, 120)">
    <path
      d="M108 265 L132 182 C144 158 168 132 192 132 L408 132 C432 132 456 158 468 182 L516 246 L534 265 C534 278 522 290 510 290 L120 290 C108 290 96 278 108 265 Z"
      fill="white"
      clip-path="url(#splashClip)"
    />

    <!-- Windshield -->
    <path
      d="M264 136 L210 225 L432 225 L400 136 Z"
      fill="white"
      opacity="0.35"
      clip-path="url(#splashClip)"
    />

    <!-- Speed lines -->
    <line x1="24" y1="182" x2="132" y2="182" stroke="white" stroke-width="28" stroke-linecap="round" />
    <line x1="48" y1="230" x2="156" y2="230" stroke="white" stroke-width="28" stroke-linecap="round" />

    <!-- Front wheel -->
    <circle cx="444" cy="298" r="56" fill="white" />

    <!-- Rear wheel -->
    <circle cx="180" cy="298" r="56" fill="white" />
  </g>

  <!-- Plus badge -->
  <g transform="translate(430, 50)">
    <circle cx="70" cy="70" r="70" fill="#10B981" />
    <line x1="70" y1="38" x2="70" y2="102" stroke="white" stroke-width="18" stroke-linecap="round" />
    <line x1="38" y1="70" x2="102" y2="70" stroke="white" stroke-width="18" stroke-linecap="round" />
  </g>
</svg>
`;

async function generateIcons() {
  console.log('Generating app icons...');

  // icon.png - 1024x1024
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, 'icon.png'));
  console.log('✓ icon.png (1024x1024)');

  // adaptive-icon.png - 1024x1024
  await sharp(Buffer.from(adaptiveIconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, 'adaptive-icon.png'));
  console.log('✓ adaptive-icon.png (1024x1024)');

  // favicon.png - 48x48
  await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(outputDir, 'favicon.png'));
  console.log('✓ favicon.png (48x48)');

  // splash.png - 1284x2778 (composited: solid blue bg + large white icon)
  const splashWidth = 1284;
  const splashHeight = 2778;
  const iconSize = 600;

  // Render the icon SVG to a buffer
  const iconBuffer = await sharp(Buffer.from(splashIconSvg))
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  // Create solid blue background and composite the icon centered
  const iconLeft = Math.round((splashWidth - iconSize) / 2);
  const iconTop = Math.round((splashHeight - iconSize) / 2) - 100; // slightly above center

  await sharp({
    create: {
      width: splashWidth,
      height: splashHeight,
      channels: 4,
      background: { r: 37, g: 99, b: 235, alpha: 1 }, // #2563EB
    },
  })
    .composite([
      { input: iconBuffer, left: iconLeft, top: iconTop },
    ])
    .png()
    .toFile(path.join(outputDir, 'splash.png'));
  console.log('✓ splash.png (1284x2778)');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
