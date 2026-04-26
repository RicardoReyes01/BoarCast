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
  TextInput,
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
  const [profile, setProfile] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  // 'create' | 'view' | 'edit'

  const [selectedPin, setSelectedPin] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempCoord, setTempCoord] = useState(null);

  const authContext = useAuth();

  const isOrgLeader = profile?.role === 'org_leader';

  // =============================
  // Load pins
  // =============================
  useEffect(() => {
    loadPins();
  }, []);

  useEffect(() => {
    savePins();
  }, [pins]);

  // =============================
  // Fetch profile
  // =============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await authContext.getToken();

        const res = await fetch(`${SERVER_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) setProfile(data);

      } catch (err) {
        console.log('Profile fetch error:', err);
      }
    };

    fetchProfile();
  }, []);

  // =============================
  // Storage
  // =============================
  const loadPins = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setPins(JSON.parse(saved));
    } catch (err) {
      console.log(err);
    }
  };

  const savePins = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // Open Create Modal (Map Tap)
  // =============================
  const handleMapPress = (event) => {
    if (!isOrgLeader) return;

    const coord = event.nativeEvent.coordinate;

    setSelectedPin(null);
    setTempCoord(coord);
    setTempTitle('');

    setModalMode('create');
    setModalVisible(true);
  };

  // =============================
  // Open View Modal (Pin Tap)
  // =============================
  const openPin = (pin) => {
    setSelectedPin(pin);
    setTempTitle(pin.title || '');
    setTempCoord(pin.coordinate);

    setModalMode('view');
    setModalVisible(true);
  };

  // =============================
  // Create Pin
  // =============================
  const createPin = () => {
    const newPin = {
      id: Date.now().toString(),
      title: tempTitle || 'Untitled Event',
      coordinate: tempCoord,
    };

    setPins((prev) => [...prev, newPin]);
    setModalVisible(false);
  };

  // =============================
  // Update Pin
  // =============================
  const updatePin = () => {
    setPins((prev) =>
      prev.map((p) =>
        p.id === selectedPin.id
          ? { ...p, title: tempTitle }
          : p
      )
    );

    setModalVisible(false);
  };

  // =============================
  // Delete Pin
  // =============================
  const deletePin = (id) => {
    Alert.alert('Delete Pin', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPins((prev) => prev.filter((p) => p.id !== id));
          setModalVisible(false);
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
        <Text style={styles.subHeaderTitle}>Campus Map</Text>
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
        onPress={handleMapPress}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            onPress={() => openPin(pin)}
          >
            <View style={styles.marker} />
          </Marker>
        ))}
      </MapView>

      {/* Help Text */}
      <View style={styles.helpBox}>
        <Text style={styles.helpText}>
          {isOrgLeader
            ? 'Tap map to create events.'
            : 'Tap a pin to view event details.'}
        </Text>
      </View>

      {/* =============================
          BOTTOM BUTTON (RESTORED)
      ============================= */}
      <View style={styles.seeAllContainer}>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => {
            setSelectedPin(null);
            setModalMode('view');
            setModalVisible(true);
          }}
        >
          <Text style={styles.seeAllText}>
            {isOrgLeader ? 'Manage Events' : 'View Events'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* =============================
          MODAL
      ============================= */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
         {/* TAP OUTSIDE AREA */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            animationType="slide"
          />
          <View style={styles.modalBox}>

            {/* CREATE MODE */}
            {modalMode === 'create' && (
              <>
                <Text style={styles.modalTitle}>Create Event</Text>

                <TextInput
                  placeholder="Event title"
                  value={tempTitle}
                  onChangeText={setTempTitle}
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={createPin}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {/* VIEW MODE */}
            {modalMode === 'view' && (
              <>
                {selectedPin ? (
                  <>
                    <Text style={styles.modalTitle}>
                      {selectedPin.title}
                    </Text>

                    <Text style={{ marginBottom: 20 }}>
                      Event details placeholder
                    </Text>

                    {isOrgLeader ? (
                      <>
                        <TouchableOpacity
                          style={styles.primaryButton}
                          onPress={() => setModalMode('edit')}
                        >
                          <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deletePin(selectedPin.id)}
                        >
                          <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableOpacity>
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
                            onPress={() => openPin(pin)}
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
              </>
            )}

            {/* EDIT MODE */}
            {modalMode === 'edit' && selectedPin && (
              <>
                <Text style={styles.modalTitle}>Edit Event</Text>

                <TextInput
                  value={tempTitle}
                  onChangeText={setTempTitle}
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={updatePin}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalMode('view')}
                >
                  <Text style={styles.buttonText}>Back</Text>
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
    marginTop: 5,
  },

  subHeaderTitle: {
    color: '#FFB81C',
    fontSize: 8,
    backgroundColor: '#FFB81C',
    width: 250,
    textAlign: 'center',
    borderRadius: 20,
    marginTop: 3,
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
    zIndex: 999,
    elevation: 10,
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

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
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