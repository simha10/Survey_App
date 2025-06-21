import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, required, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput style={styles.input} {...props} />
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
  input: {
    backgroundColor: '#F9FAFB', // gray-50
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827', // gray-900
  },
  required: {
    color: '#EF4444', // red-500
  },
});

export default FormInput; 