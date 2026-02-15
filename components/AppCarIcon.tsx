import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CAR_PATHS, SVG_INNER_TRANSFORM } from '../constants/logoPaths';

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
  gradientEnd = '#1E40AF',
  useGradient = true,
  showPlus = false,
}: AppCarIconProps) {
  const fillColor = useGradient ? 'url(#carGrad)' : (color || '#2563EB');

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="90 25 320 175" fill="none">
        <Defs>
          <LinearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientStart} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradientEnd} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <G transform={SVG_INNER_TRANSFORM} fill={fillColor} stroke="none">
          {CAR_PATHS.map((d, i) => <Path key={i} d={d} />)}
        </G>

        {showPlus && (
          <G>
            <Circle cx="380" cy="42" r="22" fill="#10B981" />
            <Path d="M380 32 L380 52 M370 42 L390 42" stroke="white" strokeWidth="5" strokeLinecap="round" />
          </G>
        )}
      </Svg>
    </View>
  );
}
