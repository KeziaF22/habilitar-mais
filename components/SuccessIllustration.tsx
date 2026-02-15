import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { CAR_PATHS, SVG_INNER_TRANSFORM } from '../constants/logoPaths';

interface SuccessIllustrationProps {
  width?: number;
  height?: number;
}

export default function SuccessIllustration({
  width = 300,
  height = 300
}: SuccessIllustrationProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 300 300" fill="none">
        <Defs>
          <LinearGradient id="successGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
          </LinearGradient>
          <LinearGradient id="successCar" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background Circles */}
        <Circle cx="150" cy="150" r="140" fill="url(#successGlow)" />
        <Circle cx="150" cy="150" r="110" fill="white" opacity="0.6" />

        {/* Success Check Circle */}
        <Circle cx="150" cy="120" r="55" fill="#10B981" />
        <Circle cx="150" cy="120" r="50" fill="white" opacity="0.1" />

        {/* Check Mark */}
        <Path
          d="M 123 120 L 141 138 L 180 95"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Car from original logo */}
        <G transform="translate(15.5, 155.4) scale(0.5)">
          <G transform={SVG_INNER_TRANSFORM} fill="url(#successCar)" stroke="none">
            {CAR_PATHS.map((d, i) => <Path key={i} d={d} />)}
          </G>
        </G>

        {/* Confetti accents */}
        <G opacity="0.6">
          <Circle cx="50" cy="85" r="5" fill="#10B981" />
          <Circle cx="248" cy="78" r="4" fill="#2563EB" />
          <Circle cx="235" cy="200" r="5" fill="#10B981" />
        </G>

        {/* Decorative Circles */}
        <Circle cx="60" cy="150" r="6" fill="#10B981" opacity="0.4" />
        <Circle cx="240" cy="150" r="5" fill="#2563EB" opacity="0.4" />
        <Circle cx="150" cy="55" r="7" fill="#10B981" opacity="0.4" />
        <Circle cx="80" cy="230" r="5" fill="#2563EB" opacity="0.4" />
        <Circle cx="220" cy="245" r="4" fill="#10B981" opacity="0.4" />
      </Svg>
    </View>
  );
}
