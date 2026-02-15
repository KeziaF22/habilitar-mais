import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';
import { CAR_PATHS, SVG_INNER_TRANSFORM } from '../constants/logoPaths';

interface EmptyStateIllustrationProps {
  width?: number;
  height?: number;
}

export default function EmptyStateIllustration({
  width = 300,
  height = 300
}: EmptyStateIllustrationProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 300 300" fill="none">
        <Defs>
          <LinearGradient id="emptyBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#1E40AF" stopOpacity="0.08" />
          </LinearGradient>
          <LinearGradient id="emptyCar" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#1E40AF" stopOpacity="0.35" />
          </LinearGradient>
        </Defs>

        {/* Background Circle */}
        <Circle cx="150" cy="150" r="140" fill="url(#emptyBg)" />
        <Circle cx="150" cy="150" r="110" fill="white" opacity="0.5" />

        {/* Road/Path */}
        <Path
          d="M 50 200 Q 150 180, 250 200"
          stroke="#2563EB"
          strokeWidth="40"
          fill="none"
          opacity="0.15"
        />

        {/* Road Dashes */}
        <Path d="M 70 200 L 90 200" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
        <Path d="M 140 195 L 160 195" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
        <Path d="M 210 200 L 230 200" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

        {/* Car from original logo - faded/empty state */}
        <G transform="translate(34.5, 74.6) scale(0.462)">
          <G transform={SVG_INNER_TRANSFORM} fill="url(#emptyCar)" stroke="none">
            {CAR_PATHS.map((d, i) => <Path key={i} d={d} />)}
          </G>
        </G>

        {/* Magnifying Glass Icon */}
        <G transform="translate(180, 130)">
          <Circle
            cx="20"
            cy="20"
            r="18"
            stroke="#2563EB"
            strokeWidth="4"
            fill="none"
            opacity="0.4"
          />
          <Circle cx="20" cy="20" r="12" fill="#2563EB" opacity="0.08" />
          <Path
            d="M 32 32 L 45 45"
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.4"
          />
        </G>

        {/* Decorative Question Mark */}
        <G transform="translate(60, 70)">
          <SvgText
            x="0"
            y="0"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="30"
            fill="#2563EB"
            opacity="0.2"
          >
            ?
          </SvgText>
        </G>

        {/* Decorative Dots - brand palette */}
        <Circle cx="220" cy="80" r="4" fill="#2563EB" opacity="0.25" />
        <Circle cx="240" cy="90" r="3" fill="#1E40AF" opacity="0.25" />
        <Circle cx="230" cy="110" r="5" fill="#10B981" opacity="0.25" />
      </Svg>
    </View>
  );
}
