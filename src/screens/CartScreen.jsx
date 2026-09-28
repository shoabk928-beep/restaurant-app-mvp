import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { CartItemCard } from '../components/CartItemCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const CartScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const {
    cart,
    increment,
    decrement,
    removeItem,
    updateNote,
    applyPromo,
    removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * cart.discountPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    applyPromo(promoInput.trim());
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={removeItem}
            onUpdateNote={updateNote}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              Your cart is empty.
            </Text>
          </View>
        }
      />

      {cart.items.length > 0 && (
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          {/* Promo Code Section */}
          <View style={styles.promoRow}>
            <Input
              placeholder="Promo Code (e.g. WELCOME10)"
              value={promoInput}
              onChangeText={setPromoInput}
              style={{ flex: 1, marginBottom: 0, marginRight: 8 }}
            />
            {cart.promoCode ? (
              <Button
                title="Remove"
                variant="outline"
                size="small"
                onPress={() => {
                  removePromo();
                  setPromoInput('');
                }}
              />
            ) : (
              <Button title="Apply" size="small" onPress={handleApplyPromo} />
            )}
          </View>

          {cart.promoCode && (
            <Text style={[styles.promoSuccess, { color: theme.success }]}>
              Promo '{cart.promoCode}' applied ({cart.discountPercent}% off)
            </Text>
          )}

          <View style={styles.divider} />

          {/* Pricing Breakdown */}
          <View style={styles.priceRow}>
            <Text style={{ color: theme.subText }}>Subtotal</Text>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>

          {cart.discountPercent > 0 && (
            <View style={styles.priceRow}>
              <Text style={{ color: theme.success }}>
                Discount ({cart.discountPercent}%)
              </Text>
              <Text style={{ color: theme.success, fontWeight: 'bold' }}>
                -${discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={[styles.priceRow, { marginTop: 8 }]}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: theme.primary }]}>
              ${grandTotal.toFixed(2)}
            </Text>
          </View>

          <Button
            title="Proceed to Checkout"
            onPress={() => navigation.navigate('Checkout')}
            style={{ marginTop: 16 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  summaryCard: {
    padding: 16,
    borderTopWidth: 1,
    elevation: 4,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoSuccess: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});