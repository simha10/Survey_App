import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FormDropdownProps {
  label: string;
  required?: boolean;
  items: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
}

const FormDropdown = forwardRef<Picker, FormDropdownProps>(({ label, required, items, value, onValueChange }, ref) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
      {label} {required ? '*' : ''}
    </Text>
    <Picker
      ref={ref}
      selectedValue={value}
      onValueChange={onValueChange}
      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6 }}
    >
      <Picker.Item label="Select an item..." value="" />
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  </View>
));

export default FormDropdown; 