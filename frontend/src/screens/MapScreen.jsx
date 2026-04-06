import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key used to save pins on the phone
const STORAGE_KEY = 'boarcast_pins';

export default function MapScreen() {
  // All saved pins
  const [pins, setPins] = useState([]);

  // Coordinates where user tapped
  const [selectedCoord, setSelectedCoord] = useState(null);

  // Name typed by user
  const [pinName, setPinName] = useState('');

  // Shows or hides the popup
  const [modalVisible, setModalVisible] = useState(false);

  // If editing a pin, store its id
  const [editingPinId, setEditingPinId] = useState(null);

  // Load pins when screen starts
  useEffect(() => {
    loadPins();
  }, []);

  // Save pins whenever they change
  useEffect(() => {
    savePins();
  }, [pins]);

  // Get pins from local storage
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

  // Save pins to local storage
  const savePins = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    } catch (error) {
      console.log('Error saving pins:', error);
    }
  };

  // When user taps the map
  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;

    setSelectedCoord(coordinate);
    setPinName('');
    setEditingPinId(null);
    setModalVisible(true);
  };

  // Close popup and clear temp values
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCoord(null);
    setPinName('');
    setEditingPinId(null);
  };

  // Save new pin or update old pin
  const savePin = () => {
    if (!selectedCoord) return;

    const trimmedName = pinName.trim() || 'Unnamed Pin';

    if (editingPinId) {
      // Update old pin
      setPins((prevPins) =>
        prevPins.map((pin) =>
          pin.id === editingPinId ? { ...pin, title: trimmedName } : pin
        )
      );
    } else {
      // Add new pin
      const newPin = {
        id: Date.now().toString(),
        coordinate: selectedCoord,
        title: trimmedName,
      };

      setPins((prevPins) => [...prevPins, newPin]);
    }

    closeModal();
  };

  // Open popup to edit a pin
  const editPin = (pin) => {
    setSelectedCoord(pin.coordinate);
    setPinName(pin.title);
    setEditingPinId(pin.id);
    setModalVisible(true);
  };

  // Delete a pin
  const deletePin = (pinId) => {
    Alert.alert('Delete Pin', 'Are you sure you want to delete this pin?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Main map */}
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
        {/* Show every saved pin */}
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            title={pin.title}
            description="Tap the label, then use edit below if needed"
          />
        ))}
      </MapView>

      {/* Top helper text */}
      <View style={styles.helpBox} pointerEvents="box-none">
        <Text style={styles.helpText}>Tap anywhere on the map to add a pin.</Text>
      </View>

      {/* Bottom list of recent pins */}
      <View style={styles.pinListOverlay} pointerEvents="box-none">
        {pins.slice(-3).map((pin) => (
          <View key={pin.id} style={styles.pinCard}>
            <Text style={styles.pinTitle}>{pin.title}</Text>

            <View style={styles.pinActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editPin(pin)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePin(pin.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Popup for naming or editing a pin */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingPinId ? 'Edit Pin' : 'Name This Pin'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter pin name"
              value={pinName}
              onChangeText={setPinName}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={savePin}>
                <Text style={styles.buttonText}>
                  {editingPinId ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  helpBox: {
    position: 'absolute',
    top: 50,
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

  pinListOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  pinCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  pinTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  pinActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalBox: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#999',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
