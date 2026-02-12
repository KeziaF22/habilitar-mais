import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Instructor } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

interface InstructorMapProps {
  instructors: Instructor[];
  onInstructorPress?: (id: string) => void;
  selectedInstructorId?: string | null;
}

const MANAUS_CENTER = {
  latitude: -3.1190,
  longitude: -60.0217,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

// Custom Map Style - Estilo "Airbnb" Clean/Silver
const CUSTOM_MAP_STYLE = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#dadada' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9c9c9' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
];

export default function InstructorMap({
  instructors,
  onInstructorPress,
  selectedInstructorId,
}: InstructorMapProps) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={MANAUS_CENTER}
      customMapStyle={CUSTOM_MAP_STYLE}
      showsPointsOfInterest={false}
      showsBuildings={false}
      showsTraffic={false}
      showsIndoors={false}
    >
      {instructors.map((instructor) => {
        const isSelected = selectedInstructorId === instructor.id;

        return (
          <Marker
            key={instructor.id}
            coordinate={instructor.coordinates}
            onPress={() => onInstructorPress?.(instructor.id)}
            tracksViewChanges={false}
          >
            <View
              style={[
                styles.pricePill,
                isSelected && styles.pricePillSelected,
              ]}
            >
              <Text style={[
                styles.priceText,
                isSelected && styles.priceTextSelected,
              ]}>
                R$ {instructor.pricePerHour.toFixed(0)}
              </Text>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Pílula de Preço - Estado Normal
  pricePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100, // Totalmente arredondada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.light.rose, // #BD6C73
  },
  // Pílula de Preço - Estado Selecionado
  pricePillSelected: {
    backgroundColor: Colors.light.rose, // #BD6C73
    borderColor: Colors.light.rose,
    elevation: 10,
  },
  // Texto do Preço - Estado Normal
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.rose, // #BD6C73
    letterSpacing: 0.3,
  },
  // Texto do Preço - Estado Selecionado
  priceTextSelected: {
    color: '#FFFFFF',
  },
});
