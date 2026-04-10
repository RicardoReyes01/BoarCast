import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../FirebaseFrontend';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

export default function RightSideMenu({ visible, onClose, navigation }) {
  const translateX = useRef(new Animated.Value(MENU_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
  if (visible) {
    translateX.setValue(MENU_WIDTH);

    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 80,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: MENU_WIDTH,
        useNativeDriver: true,
        friction: 8,
        tension: 80,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [visible]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      // navigation reset will happen via AuthContext
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* tap outside closes menu */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.menu,
          { transform: [{ translateX }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>

          <TouchableOpacity onPress={onClose}>
            <FontAwesome6 name="xmark" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
                onClose();
                navigation.navigate('Profile');
            }}
            >
            <FontAwesome6 name="user" size={18} color="#333" />
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
                onClose();
                navigation.navigate('Settings');
            }}
            >
            <FontAwesome6 name="gear" size={18} color="#333" />
            <Text style={styles.itemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
                onClose();
                navigation.navigate('Notifications');
            }}
            >
            <FontAwesome6 name="arrow-up" size={18} color="#333" />
            <Text style={styles.itemText}>Org Leader Upgrade</Text>
          </TouchableOpacity>

        </View>

        {/* Logout (important) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <FontAwesome6 name="right-from-bracket" size={18} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    position: 'absolute',
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 15,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    paddingBottom: 40,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});