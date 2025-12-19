import React from 'react';
import { View, Text, TouchableOpacity, AccessibilityProps } from 'react-native';

export type ProgressProps = {
  spiritual: number;
  health: number;
  finance: number;
  relationship: number;
};

export const HeaderProgress: React.FC<ProgressProps> = ({ spiritual, health, finance, relationship }) => {
  // Placeholder: usar design tokens de src/styles/design-tokens.json
  return (
    <View accessibilityRole="header" style={{ flexDirection: 'row', padding: 8 }}>
      <TouchableOpacity accessibilityLabel={`Espiritualidade ${Math.round(spiritual)}%`} style={{ flex: 1 }}>
        <Text>Espiritualidade</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityLabel={`Saúde ${Math.round(health)}%`} style={{ flex: 1 }}>
        <Text>Saúde</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityLabel={`Finanças ${Math.round(finance)}%`} style={{ flex: 1 }}>
        <Text>Finanças</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityLabel={`Relacionamentos ${Math.round(relationship)}%`} style={{ flex: 1 }}>
        <Text>Relacionamentos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderProgress;
