import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { getMasterData } from '../utils/storage';

interface FormDropdownProps {
  label: string;
  required?: boolean;
  items?: { label: string; value: string | number }[];
  value: string | number;
  onValueChange: (value: string | number) => void;
  /**
   * If provided, will load options from masterData[masterDataKey] in AsyncStorage
   */
  masterDataKey?: string;
  labelKey?: string;
  valueKey?: string;
}

/**
 * FormDropdown is now offline-first: if masterDataKey is provided, options are always loaded from masterData in AsyncStorage.
 * No direct API calls are made here.
 */
const FormDropdown = forwardRef<Picker, FormDropdownProps>(
  ({ label, required, items = [], value, onValueChange, masterDataKey, labelKey = 'name', valueKey = 'id' }, ref) => {
    const [options, setOptions] = useState(items);

    useEffect(() => {
      const loadOptionsFromMasterData = async () => {
        if (masterDataKey) {
          try {
            const masterData = await getMasterData();
            const arr = (masterData && masterData[masterDataKey]) ? masterData[masterDataKey] : [];
            setOptions(
              Array.isArray(arr)
                ? arr.map((item: any) => ({ label: item[labelKey], value: item[valueKey] }))
                : []
            );
          } catch (e) {
            setOptions([]);
          }
        } else {
          setOptions(items);
        }
      };
      loadOptionsFromMasterData();
    }, [masterDataKey, items, labelKey, valueKey]);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            ref={ref}
            selectedValue={value}
            onValueChange={onValueChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select an item..." value="" />
            {options.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151', // gray-700 - same as FormInput
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB', // gray-50 - same as FormInput
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300 - same as FormInput
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    color: '#111827', // gray-900 - same as FormInput
  },
  pickerItem: {
    fontSize: 16,
    color: '#111827', // gray-900 - same as FormInput
  },
  required: {
    color: '#EF4444', // red-500 - same as FormInput
  },
});

export default FormDropdown; 