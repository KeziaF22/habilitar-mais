import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G, Text as SvgText, ClipPath } from 'react-native-svg';

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
            <ClipPath id="iconClip">
              <Rect x="0" y="0" width="100" height="36" />
              <Rect x="0" y="40" width="100" height="4" />
              <Rect x="0" y="48" width="100" height="52" />
            </ClipPath>
          </Defs>
          <Circle cx="50" cy="50" r="48" fill="url(#iconGrad)" />
          {/* Car silhouette with speed line cutouts */}
          <G transform="translate(10, 20)">
            <Path
              d="M18 44 L22 30 C24 26 28 22 32 22 L54 22 C58 22 62 26 64 30 L70 40 L72 44 C72 46 70 48 68 48 L20 48 C18 48 16 46 18 44 Z"
              fill="white"
              clipPath="url(#iconClip)"
            />
            <Path d="M4 30 L18 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            <Path d="M8 38 L22 38" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            <Circle cx="60" cy="49" r="9" fill="white" />
            <Circle cx="30" cy="49" r="9" fill="white" />
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
          <ClipPath id="logoClip">
            <Rect x="0" y="0" width="100" height="34" />
            <Rect x="0" y="38" width="100" height="4" />
            <Rect x="0" y="46" width="100" height="54" />
          </ClipPath>
        </Defs>

        {/* Icon circle */}
        <Circle cx="46" cy="50" r="42" fill="url(#logoGrad)" />

        {/* Car with cutout speed lines */}
        <G transform="translate(12, 22)">
          <Path
            d="M16 40 L20 28 C22 24 26 20 30 20 L50 20 C54 20 58 24 60 28 L66 36 L68 40 C68 42 66 44 64 44 L18 44 C16 44 14 42 16 40 Z"
            fill="white"
            clipPath="url(#logoClip)"
          />
          <Path d="M4 28 L16 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <Path d="M7 36 L20 36" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <Circle cx="56" cy="45" r="8" fill="white" />
          <Circle cx="28" cy="45" r="8" fill="white" />
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
