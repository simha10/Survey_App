import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

interface FormDropdownProps extends PickerSelectProps {
  label: string;
  required?: boolean;
}

const FormDropdown: React.FC<FormDropdownProps> = ({ label, required, items, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <RNPickerSelect
        items={items}
        style={pickerSelectStyles}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151', // gray-700
  },
  required: {
    color: '#EF4444', // red-500
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    color: '#111827',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#F9FAFB',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    color: '#111827',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#F9FAFB',
  },
});

export default FormDropdown; 