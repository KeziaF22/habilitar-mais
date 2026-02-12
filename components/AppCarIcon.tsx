import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, ClipPath, Rect, G } from 'react-native-svg';

interface AppCarIconProps {
  size?: number;
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
  useGradient?: boolean;
  showPlus?: boolean;
}

export default function AppCarIcon({
  size = 48,
  color,
  gradientStart = '#2563EB',
  gradientEnd = '#06B6D4',
  useGradient = true,
  showPlus = false,
}: AppCarIconProps) {
  const fillColor = useGradient ? 'url(#carGrad)' : (color || '#2563EB');

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="carGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor={gradientStart} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradientEnd} stopOpacity="1" />
          </LinearGradient>
          {/* Clip path to create horizontal cutout lines through the car body */}
          <ClipPath id="speedClip">
            <Rect x="0" y="0" width="100" height="38" />
            <Rect x="0" y="43" width="100" height="5" />
            <Rect x="0" y="53" width="100" height="50" />
          </ClipPath>
        </Defs>

        {/* Car body - sedan silhouette with speed line cutouts */}
        <Path
          d="M20 56 L26 38 C28 34 32 28 38 26 L66 26 C72 26 76 30 80 36 L88 50 L90 54 C90 58 88 60 86 60 L22 60 C20 60 18 58 20 56 Z"
          fill={fillColor}
          clipPath="url(#speedClip)"
        />

        {/* Windshield */}
        <Path
          d="M42 28 L34 42 L56 42 L52 28 Z"
          fill={fillColor}
          opacity="0.45"
          clipPath="url(#speedClip)"
        />

        {/* Rear window */}
        <Path
          d="M56 28 L60 42 L78 46 L74 32 C72 28 68 26 64 26 Z"
          fill={fillColor}
          opacity="0.45"
          clipPath="url(#speedClip)"
        />

        {/* Speed lines extending left of car body */}
        <Path
          d="M4 38 L26 38"
          stroke={fillColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <Path
          d="M8 48 L30 48"
          stroke={fillColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Front wheel */}
        <Circle cx="74" cy="62" r="11" fill={fillColor} />
        <Circle cx="74" cy="62" r="6" fill="white" opacity="0.2" />

        {/* Rear wheel */}
        <Circle cx="36" cy="62" r="11" fill={fillColor} />
        <Circle cx="36" cy="62" r="6" fill="white" opacity="0.2" />

        {/* Headlight glow */}
        <Circle cx="88" cy="50" r="3" fill="white" opacity="0.5" />

        {/* Plus badge */}
        {showPlus && (
          <G>
            <Circle cx="82" cy="18" r="13" fill="#10B981" />
            <Path d="M82 11 L82 25 M75 18 L89 18" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </G>
        )}
      </Svg>
    </View>
  );
}
