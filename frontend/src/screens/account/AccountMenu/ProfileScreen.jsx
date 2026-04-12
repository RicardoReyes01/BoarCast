import MenuTemplate, { MenuItem } from '../Templates/MenuTemplate';
import { View } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <MenuTemplate title="Profile">

      <View style={{ backgroundColor: '#fff', borderRadius: 16 }}>

        <MenuItem
          icon="user"
          label="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />

        <MenuItem
          icon="calendar"
          label="My Events"
          onPress={() => navigation.navigate('MyEvents')}
        />

        <MenuItem
          icon="trophy"
          label="Badges"
          onPress={() => navigation.navigate('Badges')}
        />
      </View>

    </MenuTemplate>
  );
}