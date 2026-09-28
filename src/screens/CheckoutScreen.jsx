import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useForm } from '../hooks/useForm';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const CheckoutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * cart.discountPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Full Name is required';
    if (!values.phone) errors.phone = 'Phone Number is required';
    if (!values.address) errors.address = 'Delivery Address is required';
    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      name: user?.name || '',
      phone: '',
      address: '',
    },
    validate
  );

  const handlePlaceOrder = (formValues) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      clearCart();

      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Thank you ${formValues.name}. Your order total is $${grandTotal.toFixed(
          2
        )}. It will be delivered to ${formValues.address}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomeTab'),
          },
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Delivery Details</Text>

      <Input
        label="Full Name"
        placeholder="e.g. John Doe"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        error={errors.name}
      />

      <Input
        label="Phone Number"
        placeholder="e.g. +1 234 567 8900"
        value={values.phone}
        onChangeText={(text) => handleChange('phone', text)}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <Input
        label="Delivery Address"
        placeholder="Enter your full street address..."
        value={values.address}
        onChangeText={(text) => handleChange('address', text)}
        error={errors.address}
        multiline
        numberOfLines={3}
      />

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.summaryTitle, { color: theme.text }]}>
          Order Summary
        </Text>

        {cart.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={{ color: theme.text, flex: 1 }}>
              {item.quantity}x {item.name}
            </Text>
            <Text style={{ color: theme.text, fontWeight: '500' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={{ color: theme.subText }}>Subtotal</Text>
          <Text style={{ color: theme.text }}>${subtotal.toFixed(2)}</Text>
        </View>

        {discountAmount > 0 && (
          <View style={styles.priceRow}>
            <Text style={{ color: theme.success }}>Discount</Text>
            <Text style={{ color: theme.success }}>
              -${discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={[styles.priceRow, { marginTop: 6 }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>
            Total Amount
          </Text>
          <Text style={[styles.totalPrice, { color: theme.primary }]}>
            ${grandTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      <Button
        title="Confirm & Place Order"
        loading={loading}
        onPress={() => handleSubmit(handlePlaceOrder)}
        style={{ marginTop: 20 }}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});