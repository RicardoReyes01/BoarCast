import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../AccountMenu/ProfileScreen';
import EditProfile from '../Profile/EditProfile';
import MyEvents from '../Profile/MyEvents';
import Badges from '../Profile/Badges';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="MyEvents" component={MyEvents} />
      <Stack.Screen name="Badges" component={Badges} />
    </Stack.Navigator>
  );
}