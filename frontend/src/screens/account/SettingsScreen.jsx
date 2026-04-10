import MenuTemplate, { MenuItem } from './MenuTemplate';
import { View } from 'react-native';

export default function SettingsScreen() {
  return (
    <MenuTemplate title="Settings">

      <View style={{ backgroundColor: '#fff', borderRadius: 16 }}>

        <MenuItem icon="bell" label="Notifications" onPress={() => {}} />
        <MenuItem icon="lock" label="Privacy" onPress={() => {}} />
        <MenuItem icon="circle-info" label="About" onPress={() => {}} />

      </View>

    </MenuTemplate>
  );
}