import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({
  width = 180,
  height = 60
}: LogoProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 300 100" fill="none">
        <Defs>
          <LinearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background Badge */}
        <Rect x="0" y="0" width="100" height="100" rx="20" fill="#60A5FA" opacity="0.15" />

        {/* Car Icon */}
        <G transform="translate(15, 25)">
          {/* Car Body */}
          <Path
            d="M10 30 L15 15 L55 15 L60 30 L65 30 L65 42 L5 42 L5 30 Z"
            fill="url(#carBody)"
          />

          {/* Windows */}
          <Rect x="20" y="18" width="12" height="10" rx="2" fill="white" opacity="0.3" />
          <Rect x="35" y="18" width="12" height="10" rx="2" fill="white" opacity="0.3" />

          {/* Wheels */}
          <Circle cx="20" cy="42" r="6" fill="#1F2937" />
          <Circle cx="20" cy="42" r="4" fill="white" />
          <Circle cx="50" cy="42" r="6" fill="#1F2937" />
          <Circle cx="50" cy="42" r="4" fill="white" />

          {/* Headlight */}
          <Circle cx="62" cy="33" r="3" fill="#F59E0B" />

          {/* Plus Badge */}
          <G transform="translate(48, 5)">
            <Circle cx="12" cy="12" r="10" fill="#10B981" />
            <Circle cx="12" cy="12" r="8" fill="white" opacity="0.2" />
            <Path
              d="M 12 7 L 12 17 M 7 12 L 17 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </G>
        </G>

        {/* Text - Habilitar+ */}
        <G transform="translate(110, 30)">
          <SvgText
            x="0"
            y="18"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="26"
            fill="#1F2937"
          >
            Habilitar
          </SvgText>
          <SvgText
            x="0"
            y="42"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="32"
            fill="#2563EB"
          >
            +
          </SvgText>
        </G>

        {/* Decorative Line */}
        <Path
          d="M 110 50 L 190 50"
          stroke="#60A5FA"
          strokeWidth="2"
          opacity="0.4"
        />
      </Svg>
    </View>
  );
}
