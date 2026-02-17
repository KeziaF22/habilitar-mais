import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { CAR_PATHS, SVG_INNER_TRANSFORM } from '../constants/logoPaths';

interface LogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon';
}

export default function Logo({
  width = 180,
  height = 60,
  variant = 'full',
}: LogoProps) {
  if (variant === 'icon') {
    return (
      <View style={{ width, height }}>
        <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
          <Defs>
            <LinearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle cx="50" cy="50" r="48" fill="url(#iconGrad)" />
          {/* Real car from original SVG - centered in circle (50,50) */}
          <G transform="translate(-7, 23) scale(0.228)">
            <G transform={SVG_INNER_TRANSFORM} fill="white" stroke="none">
              {CAR_PATHS.map((d, i) => <Path key={i} d={d} />)}
            </G>
          </G>
          {/* Plus badge */}
          <G transform="translate(62, 8)">
            <Circle cx="14" cy="14" r="14" fill="#10B981" />
            <Path d="M14 8 L14 20 M8 14 L20 14" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </G>
        </Svg>
      </View>
    );
  }

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 320 100" fill="none">
        <Defs>
          <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Icon circle */}
        <Circle cx="46" cy="50" r="42" fill="url(#logoGrad)" />

        {/* Real car from original SVG - centered in circle (46,50) */}
        <G transform="translate(-4, 26) scale(0.2)">
          <G transform={SVG_INNER_TRANSFORM} fill="white" stroke="none">
            {CAR_PATHS.map((d, i) => <Path key={i} d={d} />)}
          </G>
        </G>

        {/* Plus badge */}
        <G transform="translate(60, 6)">
          <Circle cx="12" cy="12" r="12" fill="#10B981" />
          <Path d="M12 6 L12 18 M6 12 L18 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* Text */}
        <SvgText
          x="100"
          y="44"
          fontFamily="System"
          fontWeight="800"
          fontSize="28"
          fill="#1F2937"
        >
          Habilitar
        </SvgText>
        <SvgText
          x="238"
          y="44"
          fontFamily="System"
          fontWeight="800"
          fontSize="28"
          fill="#2563EB"
        >
          +
        </SvgText>

        {/* Accent underline */}
        <Path
          d="M100 52 L250 52"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.25"
        />
      </Svg>
    </View>
  );
}
