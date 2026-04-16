import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../AccountScreen';
import ProfileStack from './ProfileStack';
import Apply from '../AccountMenu/Apply';
import SettingsStack from '../stacks/SettingsStack';
import AdminApplications from '../../AdminApplications';
import EventManagement from '../events/EventManagement';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} />
      <Stack.Screen name="Profile" component={ProfileStack} />
      <Stack.Screen name="Settings" component={SettingsStack} />
      <Stack.Screen name="Apply" component={Apply} />
      <Stack.Screen name="AdminApplications" component={AdminApplications} />
      <Stack.Screen name="EventManagement" component={EventManagement} />
    </Stack.Navigator>
  );
}