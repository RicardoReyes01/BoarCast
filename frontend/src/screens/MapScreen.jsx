// React hooks for state + lifecycle
import React, { useEffect, useState } from 'react';

// React Native UI components
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Map components
import MapView, { Marker } from 'react-native-maps';

// Local phone storage so pins stay saved
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key name used to save/load pins from storage
const STORAGE_KEY = 'boarcast_pins';

/*
  Main Map Screen
  This screen lets users:
  - tap the map to create a pin
  - name the pin
  - edit pins
  - delete pins
  - save pins locally
*/
export default function MapScreen() {
  /*
    pins = array of all saved map pins
    Example:
    [
      {
        id: "123",
        coordinate: { latitude: 27.5, longitude: -97.8 },
        title: "Danger Area"
      }
    ]
  */
  const [pins, setPins] = useState([]);

  // Stores the map coordinates when user taps
  const [selectedCoord, setSelectedCoord] = useState(null);

  // Stores the text typed into the pin name input
  const [pinName, setPinName] = useState('');

  // Controls whether the naming popup is open
  const [modalVisible, setModalVisible] = useState(false);

  // If editing an existing pin, this stores that pin's ID
  const [editingPinId, setEditingPinId] = useState(null);

  /*
    Runs once when the screen loads
    Loads previously saved pins from phone storage
  */
  useEffect(() => {
    loadPins();
  }, []);

  /*
    Runs every time pins change
    Automatically saves the updated pin list
  */
  useEffect(() => {
    savePins();
  }, [pins]);

  /*
    Load saved pins from AsyncStorage
  */
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

  /*
    Save current pins to AsyncStorage
    JSON.stringify turns the array into text for storage
  */
  const savePins = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    } catch (error) {
      console.log('Error saving pins:', error);
    }
  };

  /*
    Runs when user taps on the map
    - gets tapped coordinates
    - opens the naming popup
  */
  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;

    setSelectedCoord(coordinate);
    setPinName('');
    setEditingPinId(null);
    setModalVisible(true);
  };

  /*
    Closes the naming/edit popup
    Also clears temporary state
  */
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCoord(null);
    setPinName('');
    setEditingPinId(null);
  };

  /*
    Save a pin
    If editingPinId exists:
      -> update existing pin
    Otherwise:
      -> create a brand new pin
  */
  const savePin = () => {
    if (!selectedCoord) return;

    const trimmedName = pinName.trim() || 'Unnamed Pin';

    // Editing an existing pin
    if (editingPinId) {
      setPins((prevPins) =>
        prevPins.map((pin) =>
          pin.id === editingPinId ? { ...pin, title: trimmedName } : pin
        )
      );
    } else {
      // Creating a brand new pin
      const newPin = {
        id: Date.now().toString(),
        coordinate: selectedCoord,
        title: trimmedName,
      };

      setPins((prevPins) => [...prevPins, newPin]);
    }

    closeModal();
  };

  /*
    Opens modal to edit an existing pin
  */
  const editPin = (pin) => {
    setSelectedCoord(pin.coordinate);
    setPinName(pin.title);
    setEditingPinId(pin.id);
    setModalVisible(true);
  };

  /*
    Deletes a pin after confirmation popup
  */
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
      {/* MAIN MAP */}
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
        {/* Draw every saved pin as a marker */}
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            title={pin.title}
            description="Tap this marker to edit"
            onCalloutPress={() => editPin(pin)}
          />
        ))}
      </MapView>

      {/* Small help box at the top */}
      <View style={styles.helpBox}>
        <Text style={styles.helpText}>Tap anywhere on the map to add a pin.</Text>
      </View>

      {/* Recent pins shown at bottom */}
      <View style={styles.pinListOverlay}>
        {pins.slice(-3).map((pin) => (
          <View key={pin.id} style={styles.pinCard}>
            <Text style={styles.pinTitle}>{pin.title}</Text>

            <View style={styles.pinActions}>
              {/* Edit button */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editPin(pin)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              {/* Delete button */}
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

      {/* Popup modal for naming/editing a pin */}
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

            {/* Input field for pin name */}
            <TextInput
              style={styles.input}
              placeholder="Enter pin name"
              value={pinName}
              onChangeText={setPinName}
            />

            <View style={styles.buttonRow}>
              {/* Cancel button */}
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Save / Update button */}
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

/*
  Styling for the map screen UI
*/
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
  },
});
