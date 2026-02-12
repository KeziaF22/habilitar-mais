import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface OnboardingIllustrationProps {
  width?: number;
  height?: number;
}

export default function OnboardingIllustration({
  width = 300,
  height = 300
}: OnboardingIllustrationProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 400 400" fill="none">
        <Defs>
          <LinearGradient id="welcomeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#1E40AF" stopOpacity="0.12" />
          </LinearGradient>
          <LinearGradient id="carGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="studentBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#10B981" stopOpacity="1" />
            <Stop offset="100%" stopColor="#059669" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="instructorBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1E40AF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background circles */}
        <Circle cx="200" cy="200" r="180" fill="url(#welcomeBg)" />
        <Circle cx="200" cy="200" r="140" fill="white" opacity="0.5" />

        {/* Connection arc */}
        <Path
          d="M 110 210 Q 200 280, 290 210"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="8,4"
          fill="none"
          opacity="0.3"
        />
        <Path
          d="M 110 210 L 290 210"
          stroke="#1E40AF"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.2"
        />

        {/* Student icon (left) */}
        <G transform="translate(60, 160)">
          <Circle cx="50" cy="50" r="45" fill="url(#studentBg)" />
          <Circle cx="50" cy="38" r="13" fill="white" />
          <Path
            d="M 30 60 Q 30 48 50 48 Q 70 48 70 60 L70 70 L30 70 Z"
            fill="white"
            opacity="0.9"
          />
          {/* Book */}
          <Rect x="40" y="55" width="20" height="14" fill="white" opacity="0.4" rx="2" />
          <Path d="M50 55 L50 69" stroke="url(#studentBg)" strokeWidth="1.5" opacity="0.6" />
        </G>

        {/* Main car (center) */}
        <G transform="translate(125, 130)">
          {/* Car body */}
          <Path
            d="M30 70 C30 70 36 48 44 42 C52 36 68 32 82 32 C96 32 108 38 114 48 C120 58 124 66 124 70 L124 78 C124 80 122 82 120 82 L34 82 C32 82 30 80 30 78 Z"
            fill="url(#carGradient)"
          />
          {/* Windows */}
          <Path
            d="M72 38 C64 38 52 40 48 46 L44 58 L84 58 L78 38 C76 38 74 38 72 38 Z"
            fill="white"
            opacity="0.3"
          />
          <Path
            d="M82 38 L88 58 L110 64 L108 52 C104 42 96 38 88 38 Z"
            fill="white"
            opacity="0.2"
          />
          {/* Speed lines */}
          <Path d="M6 52 L28 52" stroke="url(#carGradient)" strokeWidth="5" strokeLinecap="round" />
          <Path d="M10 62 L30 62" stroke="url(#carGradient)" strokeWidth="4" strokeLinecap="round" />
          <Path d="M16 72 L30 72" stroke="url(#carGradient)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* Wheels */}
          <Circle cx="54" cy="82" r="12" fill="url(#carGradient)" />
          <Circle cx="54" cy="82" r="8" fill="white" opacity="0.3" />
          <Circle cx="54" cy="82" r="4" fill="url(#carGradient)" />
          <Circle cx="106" cy="82" r="12" fill="url(#carGradient)" />
          <Circle cx="106" cy="82" r="8" fill="white" opacity="0.3" />
          <Circle cx="106" cy="82" r="4" fill="url(#carGradient)" />
          {/* Headlight */}
          <Circle cx="122" cy="64" r="4" fill="white" opacity="0.6" />
          {/* Plus badge */}
          <G transform="translate(100, -10)">
            <Circle cx="20" cy="20" r="18" fill="#10B981" />
            <Path d="M20 12 L20 28 M12 20 L28 20" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          </G>
        </G>

        {/* Instructor icon (right) */}
        <G transform="translate(290, 160)">
          <Circle cx="50" cy="50" r="45" fill="url(#instructorBg)" />
          <Circle cx="50" cy="38" r="13" fill="white" />
          <Path
            d="M 30 60 Q 30 48 50 48 Q 70 48 70 60 L70 70 L30 70 Z"
            fill="white"
            opacity="0.9"
          />
          {/* Steering wheel */}
          <Circle cx="50" cy="62" r="10" fill="none" stroke="white" strokeWidth="2.5" opacity="0.5" />
          <Circle cx="50" cy="62" r="3" fill="white" opacity="0.5" />
        </G>

        {/* Decorative dots */}
        <Circle cx="90" cy="100" r="4" fill="#2563EB" opacity="0.3" />
        <Circle cx="310" cy="100" r="4" fill="#1E40AF" opacity="0.3" />
        <Circle cx="200" cy="330" r="4" fill="#10B981" opacity="0.3" />
        <Circle cx="120" cy="320" r="3" fill="#2563EB" opacity="0.2" />
        <Circle cx="280" cy="320" r="3" fill="#1E40AF" opacity="0.2" />
      </Svg>
    </View>
  );
}
