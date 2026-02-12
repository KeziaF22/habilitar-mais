import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, Modal, StatusBar } from 'react-native';
import Mapbox, { Camera, MarkerView, MapView } from '@rnmapbox/maps';
import { Maximize2, Minimize2, MapPin, ChevronRight, Star, Navigation, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Instructor } from '@/context/AuthContext';
import { MAPBOX_ACCESS_TOKEN } from '@/constants/MapboxConfig';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface InstructorMapboxProps {
  instructors: Instructor[];
  onInstructorPress?: (id: string) => void;
  onViewProfile?: (id: string) => void;
  selectedInstructorId?: string | null;
  focusCoordinate?: [number, number] | null;
}

export default function InstructorMapbox({
  instructors,
  onInstructorPress,
  onViewProfile,
  selectedInstructorId,
  focusCoordinate,
}: InstructorMapboxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const fullscreenCameraRef = useRef<Camera>(null);
  const MANAUS_CENTER: [number, number] = [-60.0217, -3.1190];

  const selectedInstructor = selectedInstructorId
    ? instructors.find((i) => i.id === selectedInstructorId)
    : null;

  const centerCoord = focusCoordinate || MANAUS_CENTER;

  const renderMarkers = () =>
    instructors.map((instructor) => {
      const isSelected = selectedInstructorId === instructor.id;
      const coordinates: [number, number] = [
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
            <View style={styles.markerWrapper}>
              <View style={[styles.markerBubble, isSelected && styles.markerBubbleSelected]}>
                <View style={styles.markerContent}>
                  <Navigation
                    size={12}
                    color={isSelected ? '#FFFFFF' : '#2563EB'}
                    style={{ marginRight: 4, transform: [{ rotate: '90deg' }] }}
                  />
                  <Text style={[styles.markerPrice, isSelected && styles.markerPriceSelected]}>
                    R${instructor.pricePerHour}
                  </Text>
                </View>
              </View>
              <View style={[styles.markerArrow, isSelected && styles.markerArrowSelected]} />
            </View>
          </TouchableOpacity>
        </MarkerView>
      );
    });

  const renderCallout = () => {
    if (!selectedInstructor) return null;
    return (
      <View style={styles.calloutContainer}>
        <View style={styles.callout}>
          <Image
            source={{ uri: selectedInstructor.profileImage }}
            style={styles.calloutImage}
          />
          <View style={styles.calloutInfo}>
            <Text style={styles.calloutName} numberOfLines={1}>
              {selectedInstructor.name}
            </Text>
            <View style={styles.calloutLocationRow}>
              <MapPin size={12} color={Colors.light.textSecondary} />
              <Text style={styles.calloutLocation} numberOfLines={1}>
                {selectedInstructor.location}
              </Text>
            </View>
            <View style={styles.calloutMeta}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.calloutRating}>{selectedInstructor.rating}</Text>
              <Text style={styles.calloutPrice}>
                R$ {selectedInstructor.pricePerHour}/h
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.calloutButton}
            onPress={() => onViewProfile?.(selectedInstructor.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.calloutButtonText}>Ver</Text>
            <ChevronRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Inline map (collapsed) */}
      <View style={[styles.container, { height: 250 }]}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/standard"
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          compassEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Camera
            ref={cameraRef}
            zoomLevel={focusCoordinate ? 14 : 12}
            centerCoordinate={centerCoord}
            animationMode="flyTo"
            animationDuration={1000}
          />
          {renderMarkers()}
        </MapView>

        {/* Expand Button */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(true)}
          activeOpacity={0.8}
        >
          <Maximize2 size={18} color="#2563EB" />
        </TouchableOpacity>

        {renderCallout()}
      </View>

      {/* Fullscreen Modal */}
      <Modal
        visible={isExpanded}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsExpanded(false)}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.fullscreenContainer}>
          <MapView
            style={styles.map}
            styleURL="mapbox://styles/mapbox/standard"
            logoEnabled={false}
            attributionEnabled={false}
            scaleBarEnabled={false}
            compassEnabled
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Camera
              ref={fullscreenCameraRef}
              zoomLevel={focusCoordinate ? 14 : 12}
              centerCoordinate={centerCoord}
              animationMode="flyTo"
              animationDuration={800}
            />
            {renderMarkers()}
          </MapView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsExpanded(false)}
            activeOpacity={0.8}
          >
            <X size={22} color="#2563EB" />
          </TouchableOpacity>

          {renderCallout()}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  map: {
    flex: 1,
  },

  // -- Custom marker styles --
  markerWrapper: {
    alignItems: 'center',
  },
  markerBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  markerBubbleSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#1E40AF',
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.4,
  },
  markerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.2,
  },
  markerPriceSelected: {
    color: '#FFFFFF',
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2563EB',
    marginTop: -1,
  },
  markerArrowSelected: {
    borderTopColor: '#1E40AF',
  },

  // -- Fullscreen --
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  // -- Expand button --
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  // -- Close button (fullscreen) --
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  // -- Callout styles --
  calloutContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
  },
  calloutImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: Colors.light.surfaceVariant,
  },
  calloutInfo: {
    flex: 1,
    marginRight: 8,
  },
  calloutName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  calloutLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  calloutLocation: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  calloutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calloutRating: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  calloutPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    marginLeft: 8,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
  calloutButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
