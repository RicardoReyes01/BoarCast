import React from 'react';
import MenuTemplate, { MenuItem } from './MenuTemplate';
import { View } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <MenuTemplate title="Profile">

      <View style={{ backgroundColor: '#fff', borderRadius: 16 }}>

        <MenuItem icon="user" label="Edit Profile" onPress={() => {}} />
        <MenuItem icon="calendar" label="My Events" onPress={() => {}} />
        <MenuItem icon="trophy" label="Badges" onPress={() => {}} />

      </View>

    </MenuTemplate>
  );
}