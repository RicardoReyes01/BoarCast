import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';

// Main screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import CalendarScreen from '../screens/CalendarScreen';

// Account tab to new stack
import AccountStack from '../screens/account/stacks/AccountStack';

// Auth screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// AuthProvider and useAuth from AuthContext
import { AuthProvider, useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// MainTabs shown to logged-in users
// Keeps account stack intact
function MainTabs() {
  return (
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
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
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
  );
}

// AuthStack — shown to logged-out users
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}


// RootNavigator — switches between auth and main app
// based on whether the user is logged in

function RootNavigator() {
  const { currentUser } = useAuth();
  return currentUser ? <MainTabs /> : <AuthStack />;
}

// AppNavigator — root export
// AuthProvider must wrap everything so useAuth() works in every screen

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
