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
            <Stop offset="0%" stopColor="#92A1C2" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#BD6C73" stopOpacity="0.15" />
          </LinearGradient>
          <LinearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#BD6C73" stopOpacity="1" />
            <Stop offset="100%" stopColor="#A2B69C" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background Circle */}
        <Circle cx="200" cy="200" r="180" fill="url(#welcomeBg)" />
        <Circle cx="200" cy="200" r="150" fill="white" opacity="0.5" />

        {/* Connection Lines */}
        <Path
          d="M 100 200 L 300 200"
          stroke="#92A1C2"
          strokeWidth="3"
          strokeDasharray="10,5"
          opacity="0.6"
        />
        <Path
          d="M 100 200 Q 200 250, 300 200"
          stroke="#92A1C2"
          strokeWidth="3"
          strokeDasharray="10,5"
          opacity="0.4"
        />

        {/* Student Icon (Left) */}
        <G transform="translate(50, 150)">
          <Circle cx="50" cy="50" r="45" fill="#A2B69C" opacity="0.9" />
          <Circle cx="50" cy="50" r="40" fill="white" opacity="0.2" />
          {/* Student Head */}
          <Circle cx="50" cy="40" r="15" fill="white" />
          {/* Student Body */}
          <Path
            d="M 35 55 L 35 75 M 65 55 L 65 75 M 35 55 L 65 55 M 35 75 L 30 85 M 65 75 L 70 85"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Book */}
          <Rect x="40" y="60" width="20" height="15" fill="#2E365A" opacity="0.7" rx="2" />
        </G>

        {/* Main Car (Center) */}
        <G transform="translate(130, 140)">
          {/* Car Body */}
          <Path
            d="M20 60 L35 30 L115 30 L130 60 L140 60 L140 80 L10 80 L10 60 Z"
            fill="url(#carGradient)"
          />
          {/* Windows */}
          <Rect x="45" y="35" width="25" height="20" rx="3" fill="white" opacity="0.4" />
          <Rect x="80" y="35" width="25" height="20" rx="3" fill="white" opacity="0.4" />
          {/* Wheels */}
          <Circle cx="40" cy="80" r="12" fill="#2E365A" />
          <Circle cx="40" cy="80" r="8" fill="white" />
          <Circle cx="110" cy="80" r="12" fill="#2E365A" />
          <Circle cx="110" cy="80" r="8" fill="white" />
          {/* Headlight */}
          <Circle cx="135" cy="65" r="5" fill="#A2B69C" />
          {/* Plus Badge */}
          <G transform="translate(105, -15)">
            <Circle cx="25" cy="25" r="20" fill="#BD6C73" />
            <Circle cx="25" cy="25" r="17" fill="white" opacity="0.2" />
            <Path
              d="M 25 15 L 25 35 M 15 25 L 35 25"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </G>
        </G>

        {/* Instructor Icon (Right) */}
        <G transform="translate(300, 150)">
          <Circle cx="50" cy="50" r="45" fill="#BD6C73" opacity="0.9" />
          <Circle cx="50" cy="50" r="40" fill="white" opacity="0.2" />
          {/* Instructor Head */}
          <Circle cx="50" cy="40" r="15" fill="white" />
          {/* Instructor Body */}
          <Path
            d="M 35 55 L 35 75 M 65 55 L 65 75 M 35 55 L 65 55 M 35 75 L 30 85 M 65 75 L 70 85"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Steering Wheel */}
          <Circle cx="50" cy="65" r="10" fill="none" stroke="#2E365A" strokeWidth="3" opacity="0.7" />
          <Circle cx="50" cy="65" r="3" fill="#2E365A" opacity="0.7" />
        </G>

        {/* Decorative Stars */}
        <G opacity="0.5">
          <Path
            d="M 80 80 L 82 86 L 88 88 L 82 90 L 80 96 L 78 90 L 72 88 L 78 86 Z"
            fill="#A2B69C"
          />
          <Path
            d="M 320 80 L 322 86 L 328 88 L 322 90 L 320 96 L 318 90 L 312 88 L 318 86 Z"
            fill="#BD6C73"
          />
          <Path
            d="M 200 320 L 202 326 L 208 328 L 202 330 L 200 336 L 198 330 L 192 328 L 198 326 Z"
            fill="#92A1C2"
          />
        </G>
      </Svg>
    </View>
  );
}
