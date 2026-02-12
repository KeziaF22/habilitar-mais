import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';

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
            <Stop offset="0%" stopColor="#92A1C2" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#BD6C73" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        {/* Background Circle */}
        <Circle cx="150" cy="150" r="140" fill="url(#emptyBg)" />
        <Circle cx="150" cy="150" r="110" fill="white" opacity="0.5" />

        {/* Road/Path */}
        <Path
          d="M 50 200 Q 150 180, 250 200"
          stroke="#92A1C2"
          strokeWidth="40"
          fill="none"
          opacity="0.3"
        />

        {/* Road Dashes */}
        <Path
          d="M 70 200 L 90 200"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />
        <Path
          d="M 140 195 L 160 195"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />
        <Path
          d="M 210 200 L 230 200"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Sad/Empty Car */}
        <G transform="translate(95, 100)">
          {/* Car Body */}
          <Path
            d="M15 40 L25 20 L85 20 L95 40 L100 40 L100 55 L10 55 L10 40 Z"
            fill="#6B597F"
            opacity="0.5"
          />

          {/* Windows */}
          <Rect x="32" y="24" width="20" height="16" rx="2" fill="white" opacity="0.3" />
          <Rect x="58" y="24" width="20" height="16" rx="2" fill="white" opacity="0.3" />

          {/* Sad Face on Front */}
          <G transform="translate(85, 30)">
            {/* Eyes */}
            <Circle cx="5" cy="5" r="2" fill="#2E365A" opacity="0.5" />
            <Circle cx="12" cy="5" r="2" fill="#2E365A" opacity="0.5" />
            {/* Sad Mouth */}
            <Path
              d="M 5 12 Q 8.5 10, 12 12"
              stroke="#2E365A"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
          </G>

          {/* Wheels */}
          <Circle cx="30" cy="55" r="8" fill="#2E365A" opacity="0.4" />
          <Circle cx="30" cy="55" r="5" fill="white" opacity="0.3" />
          <Circle cx="80" cy="55" r="8" fill="#2E365A" opacity="0.4" />
          <Circle cx="80" cy="55" r="5" fill="white" opacity="0.3" />
        </G>

        {/* Magnifying Glass Icon */}
        <G transform="translate(180, 140)">
          <Circle
            cx="20"
            cy="20"
            r="18"
            stroke="#BD6C73"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />
          <Circle cx="20" cy="20" r="12" fill="#BD6C73" opacity="0.1" />
          <Path
            d="M 32 32 L 45 45"
            stroke="#BD6C73"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
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
            fill="#A2B69C"
            opacity="0.3"
          >
            ?
          </SvgText>
        </G>

        {/* Decorative Dots */}
        <Circle cx="220" cy="80" r="4" fill="#92A1C2" opacity="0.3" />
        <Circle cx="240" cy="90" r="3" fill="#BD6C73" opacity="0.3" />
        <Circle cx="230" cy="110" r="5" fill="#A2B69C" opacity="0.3" />
      </Svg>
    </View>
  );
}
