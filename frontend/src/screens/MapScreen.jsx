// =============================
// React + React Native Imports
// =============================
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';

// =============================
// Map + Storage Imports
// =============================
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =============================
// Auth Context
// =============================
import { useAuth } from '../context/AuthContext';

// =============================
// Constants
// =============================
const STORAGE_KEY = 'boarcast_pins';
const SERVER_URL = "https://boarcast-production.up.railway.app";

// =============================
// Main Component
// =============================
export default function MapScreen({ navigation }) {
  // =============================
  // State
  // =============================
  const [pins, setPins] = useState([]);
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [profile, setProfile] = useState(null);

  const [selectedPin, setSelectedPin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const authContext = useAuth();

  // Role check
  const isOrgLeader = profile?.role === 'org_leader';

  // =============================
  // Load pins from local storage
  // =============================
  useEffect(() => {
    loadPins();
  }, []);

  // =============================
  // Save pins when updated
  // =============================
  useEffect(() => {
    savePins();
  }, [pins]);

  // =============================
  // Fetch user profile
  // =============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await authContext.getToken();

        const res = await fetch(`${SERVER_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProfile(data);
        }
      } catch (err) {
        console.log('Profile fetch error:', err);
      }
    };

    fetchProfile();
  }, []);

  // =============================
  // Load Pins
  // =============================
  const loadPins = async () => {
    try {
      const savedPins = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPins) {
        setPins(JSON.parse(savedPins));
      }
    } catch (error) {
      console.log('Error loading pins:', error);
    }
  };

  // =============================
  // Save Pins
  // =============================
  const savePins = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    } catch (error) {
      console.log('Error saving pins:', error);
    }
  };

  // =============================
  // Handle Map Tap (Org Leaders Only)
  // =============================
  const handleMapPress = (event) => {
    if (!isOrgLeader) return;

    const coordinate = event.nativeEvent.coordinate;
    setSelectedCoord(coordinate);

    setSelectedPin({ coordinate });
    setModalVisible(true);
  };

  // =============================
  // Open Event (Non-Org Users)
  // =============================
  const openEvent = (pin) => {
    setSelectedPin(pin);
    setModalVisible(true);
  };

  // =============================
  // Delete Pin (Future use)
  // =============================
  const deletePin = (pinId) => {
    Alert.alert('Delete Pin', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPins((prev) => prev.filter((p) => p.id !== pinId));
        },
      },
    ]);
  };

  // =============================
  // Render
  // =============================
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Map</Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 27.5251,
          longitude: -97.8825,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={isOrgLeader ? handleMapPress : undefined}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            onPress={() => {
              setSelectedPin(pin);
              setModalVisible(true);
            }}
          >
            <View style={styles.marker} />
          </Marker>
        ))}
      </MapView>

      {/* Help Text */}
      <View style={styles.helpBox}>
        <Text style={styles.helpText}>
          {isOrgLeader
            ? 'Tap anywhere to manage events.'
            : 'Tap a pin to view event details.'}
        </Text>
      </View>

      {/* Bottom Button */}
      <View style={styles.seeAllContainer}>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => {
            setSelectedPin(null); // show all events
            setModalVisible(true);
          }}
        >
          <Text style={styles.seeAllText}>
            {isOrgLeader ? 'Manage Events' : 'View Events'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* =============================
          MODAL POPUP
      ============================= */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {selectedPin ? (
              <>
                <Text style={styles.modalTitle}>
                  {selectedPin.title || 'Event'}
                </Text>

                {!isOrgLeader ? (
                  <>
                    <Text style={{ marginBottom: 15 }}>
                      Event details will go here.
                    </Text>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate('Account', {
                          screen: 'EventManagement',
                          params: { pin: selectedPin },
                        });
                      }}
                    >
                      <Text style={styles.buttonText}>Manage Event</Text>
                    </TouchableOpacity>

                    {selectedPin?.id && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          deletePin(selectedPin.id);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.buttonText}>Delete Pin</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>All Events</Text>

                <ScrollView style={{ maxHeight: 300 }}>
                  {pins.length === 0 ? (
                    <Text>No events yet.</Text>
                  ) : (
                    pins.map((pin) => (
                      <TouchableOpacity
                        key={pin.id}
                        style={styles.pinItem}
                        onPress={() => setSelectedPin(pin)}
                      >
                        <Text style={styles.pinItemText}>
                          {pin.title || 'Unnamed Event'}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

// =============================
// Styles
// =============================
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#0202df',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 15,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },

  map: { flex: 1 },

  marker: {
    backgroundColor: '#0202df',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFB81C',
  },

  helpBox: {
    position: 'absolute',
    top: 140,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 10,
    borderRadius: 10,
  },

  helpText: {
    textAlign: 'center',
    fontWeight: '600',
  },

  seeAllContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: 'center',
  },

  seeAllButton: {
    backgroundColor: '#0202df',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },

  seeAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  primaryButton: {
    backgroundColor: '#0202df',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  deleteButton: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  pinItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  pinItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});