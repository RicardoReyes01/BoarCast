import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Notifications from "../Settings/Notifications";
import Privacy from "../Settings/Privacy";
import About from "../Settings/About";
import SettingsScreen from "../AccountMenu/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  ); 
}