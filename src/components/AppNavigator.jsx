import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
const Tab = createBottomTabNavigator();

function MapScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Map Screen</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Account Screen</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1A1A1A',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#FFF',
            height: 85,
            paddingBottom: 20,
            paddingTop: 10,
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>🗺️</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Account" 
          component={AccountScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});