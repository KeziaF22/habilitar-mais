import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G } from 'react-native-svg';

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
        </Defs>

        {/* Background Circles */}
        <Circle cx="150" cy="150" r="140" fill="url(#successGlow)" />
        <Circle cx="150" cy="150" r="110" fill="white" opacity="0.6" />

        {/* Success Check Circle */}
        <Circle cx="150" cy="150" r="60" fill="#10B981" />
        <Circle cx="150" cy="150" r="55" fill="white" opacity="0.1" />

        {/* Check Mark */}
        <Path
          d="M 120 150 L 140 170 L 185 120"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Happy Car */}
        <G transform="translate(85, 200)">
          {/* Car Body */}
          <Path
            d="M15 25 L25 10 L95 10 L105 25 L110 25 L110 38 L10 38 L10 25 Z"
            fill="#2563EB"
          />

          {/* Windows */}
          <Rect x="32" y="13" width="20" height="12" rx="2" fill="white" opacity="0.4" />
          <Rect x="58" y="13" width="20" height="12" rx="2" fill="white" opacity="0.4" />

          {/* Happy Face (Eyes and Smile) */}
          <G transform="translate(88, 18)">
            <Circle cx="4" cy="4" r="2" fill="white" />
            <Circle cx="12" cy="4" r="2" fill="white" />
            <Path
              d="M 4 10 Q 8 13, 12 10"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </G>

          {/* Wheels */}
          <Circle cx="30" cy="38" r="8" fill="#1F2937" />
          <Circle cx="30" cy="38" r="5" fill="white" />
          <Circle cx="90" cy="38" r="8" fill="#1F2937" />
          <Circle cx="90" cy="38" r="5" fill="white" />
        </G>

        {/* Confetti Stars (Static) */}
        <G opacity="0.6">
          {/* Star 1 */}
          <Path
            d="M 50 80 L 52 86 L 58 86 L 53 90 L 55 96 L 50 92 L 45 96 L 47 90 L 42 86 L 48 86 Z"
            fill="#F59E0B"
          />

          {/* Star 2 */}
          <Path
            d="M 240 70 L 242 76 L 248 76 L 243 80 L 245 86 L 240 82 L 235 86 L 237 80 L 232 76 L 238 76 Z"
            fill="#06B6D4"
          />

          {/* Star 3 */}
          <Path
            d="M 220 210 L 222 216 L 228 216 L 223 220 L 225 226 L 220 222 L 215 226 L 217 220 L 212 216 L 218 216 Z"
            fill="#10B981"
          />
        </G>

        {/* Decorative Circles */}
        <Circle cx="60" cy="150" r="8" fill="#F59E0B" opacity="0.5" />
        <Circle cx="240" cy="150" r="6" fill="#06B6D4" opacity="0.5" />
        <Circle cx="150" cy="60" r="10" fill="#10B981" opacity="0.5" />
        <Circle cx="80" cy="220" r="7" fill="#2563EB" opacity="0.5" />
        <Circle cx="220" cy="240" r="5" fill="#F59E0B" opacity="0.5" />
      </Svg>
    </View>
  );
}
