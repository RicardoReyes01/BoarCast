import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

function CalendarScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Calendar Screen</Text>
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
              <FontAwesome
                name="home"
                size={focused ? 26 : 24}
                color={focused ? '#1A1A1A' : '#999'}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="map"
                size={focused ? 26 : 24}
                color={focused ? '#1A1A1A' : '#999'}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="calendar-days"
                size={focused ? 26 : 24}
                color={focused ? '#1A1A1A' : '#999'}
              />             ),
          }}
        />
        <Tab.Screen 
          name="Account" 
          component={AccountScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="circle-user"
                size={focused ? 26 : 24}
                color={focused ? '#1A1A1A' : '#999'}
              />            
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
    fontWeight: '1500',
    color: '#1A1A1A',
  },
});