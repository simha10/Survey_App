import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // If not available, use a simple input for now
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const SYNCED_SURVEYS_LOG_KEY = '@syncedSurveysLog';

export default function SurveyCountScreen() {
  const navigation = useNavigation();
  const [log, setLog] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLog = async () => {
        let userRaw = await AsyncStorage.getItem('user');
        if (!userRaw) userRaw = await AsyncStorage.getItem('userInfo');
        const uid = userRaw ? JSON.parse(userRaw)?.id : null;
        setUserId(uid);
        const logRaw = await AsyncStorage.getItem(SYNCED_SURVEYS_LOG_KEY);
        const logArr = logRaw ? JSON.parse(logRaw) : [];
        setLog(logArr);
      };
      fetchLog();
    }, [])
  );

  const filtered = log.filter(
    entry =>
      (!userId || entry.userId === userId) &&
      (!startDate || new Date(entry.syncedAt) >= startDate) &&
      (!endDate || new Date(entry.syncedAt) <= endDate)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Survey Count</Text>
      </View>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateCard} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{startDate ? startDate.toLocaleDateString() : 'All'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateCard} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{endDate ? endDate.toLocaleDateString() : 'All'}</Text>
        </TouchableOpacity>
      </View>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Synced Surveys</Text>
        <Text style={styles.summaryCount}>{filtered.length}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { padding: 8, marginRight: 12 },
  backButtonText: { fontSize: 24, color: '#3B82F6', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', margin: 16 },
  dateCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  dateLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  dateValue: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    elevation: 3,
  },
  summaryTitle: { fontSize: 18, color: '#374151', marginBottom: 8 },
  summaryCount: { fontSize: 36, fontWeight: 'bold', color: '#3B82F6' },
});
