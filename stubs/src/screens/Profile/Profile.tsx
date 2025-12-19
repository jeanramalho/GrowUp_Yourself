import React from 'react';
import { View, Text, Button } from 'react-native';

export const ProfileScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Perfil (stub)</Text>
      <Text>Design por Jean Ramalho</Text>
      <Button title="Exportar backup" onPress={() => { /* call backup service */ }} />
    </View>
  );
};

export default ProfileScreen;
