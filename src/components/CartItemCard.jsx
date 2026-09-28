import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const CartItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onUpdateNote,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
          <Text style={{ color: theme.error, fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Special Instructions / Note */}
      <TextInput
        style={[
          styles.noteInput,
          { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
        ]}
        placeholder="Add special instructions..."
        placeholderTextColor={theme.subText}
        value={item.note || ''}
        onChangeText={(text) => onUpdateNote(item.id, text)}
      />

      <View style={styles.bottomRow}>
        <Text style={{ color: theme.subText, fontSize: 12 }}>
          ${item.price.toFixed(2)} each
        </Text>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => onDecrement(item.id)}
            style={[styles.qtyBtn, { backgroundColor: theme.border }]}
          >
            <Text style={[styles.qtyText, { color: theme.text }]}>-</Text>
          </TouchableOpacity>

          <Text style={[styles.quantity, { color: theme.text }]}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            onPress={() => onIncrement(item.id)}
            style={[styles.qtyBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.qtyText, { color: '#FFFFFF' }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    marginTop: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
});
