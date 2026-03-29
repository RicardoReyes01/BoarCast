import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';
import CalendarScreen from '../screens/CalendarScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Auth context — provides currentUser to the whole app
import { AuthProvider, useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─────────────────────────────────────────────
// MainTabs — shown to logged-in users
// This is your partner's original tab navigator, unchanged
// ─────────────────────────────────────────────
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
  );
}

// ─────────────────────────────────────────────
// AuthStack — shown to logged-out users
// Stack navigator so Login and Register can navigate between each other
// headerShown: false removes the default back button header bar
// ─────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────
// RootNavigator — the decision maker
// Reads currentUser from AuthContext
// If logged in → show main tabs
// If logged out → show login/register screens
// This switch happens automatically whenever auth state changes
// e.g. signing in, signing out, or app reopening with existing session
// ─────────────────────────────────────────────
function RootNavigator() {
  const { currentUser } = useAuth();
  return currentUser ? <MainTabs /> : <AuthStack />;
}

// ─────────────────────────────────────────────
// AppNavigator — the root export
// AuthProvider must wrap everything so every screen can access auth state
// NavigationContainer must wrap all navigation — required by React Navigation
// ─────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
