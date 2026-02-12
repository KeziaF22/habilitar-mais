import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Mapbox, { Camera, MarkerView, MapView } from '@rnmapbox/maps';
import Colors from '@/constants/Colors';
import { Instructor } from '@/context/AuthContext';
import { MAPBOX_ACCESS_TOKEN } from '@/constants/MapboxConfig';

// Configure o token no arquivo: constants/MapboxConfig.ts
Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface InstructorMapboxProps {
  instructors: Instructor[];
  onInstructorPress?: (id: string) => void;
  selectedInstructorId?: string | null;
}

export default function InstructorMapbox({
  instructors,
  onInstructorPress,
  selectedInstructorId,
}: InstructorMapboxProps) {
  // Centro em Manaus
  const MANAUS_CENTER = [-60.0217, -3.1190]; // [longitude, latitude] - Mapbox usa lon/lat

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/light-v11" // Estilo minimalista claro
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Camera
          zoomLevel={12}
          centerCoordinate={MANAUS_CENTER}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {instructors.map((instructor) => {
          const isSelected = selectedInstructorId === instructor.id;
          const coordinates = [
            instructor.coordinates.longitude,
            instructor.coordinates.latitude,
          ];

          return (
            <MarkerView
              key={instructor.id}
              coordinate={coordinates}
              anchor={{ x: 0.5, y: 1 }}
              allowOverlap
            >
              <TouchableOpacity
                onPress={() => onInstructorPress?.(instructor.id)}
                activeOpacity={0.8}
              >
                <View style={styles.markerContainer}>
                  {/* Pin vertical (opcional) */}
                  <View style={[styles.pin, isSelected && styles.pinSelected]} />

                  {/* Marcador circular com preço */}
                  <View
                    style={[
                      styles.priceMarker,
                      isSelected && styles.priceMarkerSelected,
                    ]}
                  >
                    <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                      R$ {instructor.pricePerHour}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </MarkerView>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  pin: {
    width: 2,
    height: 12,
    backgroundColor: Colors.light.primary,
    marginBottom: 2,
  },
  pinSelected: {
    backgroundColor: Colors.light.error,
  },
  priceMarker: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  priceMarkerSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.error,
    borderWidth: 3,
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  priceTextSelected: {
    color: Colors.light.surface,
  },
});
