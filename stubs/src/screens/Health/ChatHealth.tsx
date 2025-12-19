import React from 'react';
import { View, Text, Button } from 'react-native';

export const ChatHealth: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Chat Saúde (stub)</Text>
      <Text>Disclaimer: Sugestões não substituem avaliação médica</Text>
      <Button title="Quick: Cumpri meta" onPress={() => { /* call quick-action */ }} />
    </View>
  );
};

export default ChatHealth;
