import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../hooks/useReservation';
import { TIME_SLOTS } from '../data/tables';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const ReservationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getAvailableTables, createReservation } = useReservation();

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [partySize, setPartySize] = useState('2');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [selectedTableId, setSelectedTableId] = useState(null);

  const availableTables = getAvailableTables(
    date,
    selectedSlot,
    parseInt(partySize, 10) || 1
  );

  const handleBookTable = () => {
    if (!customerName.trim() || !phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your name and phone number.');
      return;
    }

    if (!selectedTableId) {
      Alert.alert('Selection Error', 'Please select an available table.');
      return;
    }

    const res = createReservation({
      userId: user?.id || 'guest',
      customerName,
      phone,
      date,
      timeSlot: selectedSlot,
      partySize: parseInt(partySize, 10),
      tableId: selectedTableId,
    });

    Alert.alert(
      'Reservation Confirmed! 🎉',
      `Booking ID: ${res.id}\nDate: ${date}\nTime: ${selectedSlot}\nGuests: ${partySize}`,
      [{ text: 'OK', onPress: () => setSelectedTableId(null) }]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Book a Table</Text>

      {/* Guest Details */}
      <Input
        label="Name"
        placeholder="Enter your name"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <Input
        label="Phone Number"
        placeholder="e.g. +1 234 567 8900"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Date & Party Size */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input
            label="Date (YYYY-MM-DD)"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <Input
            label="Party Size"
            placeholder="No. of guests"
            value={partySize}
            onChangeText={setPartySize}
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* Time Slot Picker */}
      <Text style={[styles.label, { color: theme.text }]}>Select Time Slot</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.slotScrollView}
      >
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              onPress={() => {
                setSelectedSlot(slot);
                setSelectedTableId(null);
              }}
              style={[
                styles.slotChip,
                {
                  backgroundColor: isSelected
                    ? theme.primary
                    : theme.cardBackground,
                  borderColor: isSelected ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? '#FFFFFF' : theme.text,
                  fontWeight: '600',
                }}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Available Tables */}
      <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>
        Available Tables ({availableTables.length})
      </Text>

      {availableTables.length === 0 ? (
        <Text style={[styles.noTableText, { color: theme.subText }]}>
          No tables available for selected capacity/time slot. Try changing party size or time.
        </Text>
      ) : (
        <View style={styles.tablesGrid}>
          {availableTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            return (
              <TouchableOpacity
                key={table.id}
                onPress={() => setSelectedTableId(table.id)}
                style={[
                  styles.tableCard,
                  {
                    backgroundColor: isSelected
                      ? theme.primary
                      : theme.cardBackground,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tableName,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  Table {table.tableNumber}
                </Text>
                <Text
                  style={[
                    styles.tableCapacity,
                    { color: isSelected ? '#F0F0F0' : theme.subText },
                  ]}
                >
                  Capacity: {table.capacity}
                </Text>
                <Text
                  style={[
                    styles.tableLocation,
                    { color: isSelected ? '#F0F0F0' : theme.subText },
                  ]}
                >
                  {table.location}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Button
        title="Reserve Table"
        onPress={handleBookTable}
        disabled={!selectedTableId}
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  slotScrollView: {
    marginBottom: 10,
  },
  slotChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  noTableText: {
    fontSize: 14,
    marginVertical: 12,
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tableCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableCapacity: {
    fontSize: 12,
    marginTop: 4,
  },
  tableLocation: {
    fontSize: 12,
    marginTop: 2,
  },
});