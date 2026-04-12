import MenuTemplate, { MenuItem } from '../Templates/MenuTemplate';
import { View } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <MenuTemplate title="Settings">

      <View style={{ backgroundColor: '#fff', borderRadius: 16 }}>

        <MenuItem
          icon="bell"
          label="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        
        <MenuItem
          icon="lock"
          label="Privacy"
          onPress={() => navigation.navigate('Privacy')}
        />
        
        <MenuItem
          icon="circle-info"
          label="About"
          onPress={() => navigation.navigate('About')}
        />
      </View>

    </MenuTemplate>
  );
}