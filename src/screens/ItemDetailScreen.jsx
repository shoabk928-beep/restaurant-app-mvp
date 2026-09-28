import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ItemDetailScreen = ({ route, navigation }) => {
  const { menuItem } = route.params;
  const { theme } = useTheme();
  const { addItem, updateNote } = useCart();
  const [note, setNote] = useState('');

  const handleAddToCart = () => {
    addItem(menuItem);
    if (note.trim()) {
      updateNote(menuItem.id, note);
    }
    Alert.alert('Success', `${menuItem.name} added to cart!`, [
      { text: 'Continue Shopping', onPress: () => navigation.goBack() },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: menuItem.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {menuItem.name}
          </Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            ${menuItem.price.toFixed(2)}
          </Text>
        </View>

        <Text style={[styles.category, { color: theme.subText }]}>
          Category: {menuItem.category}
        </Text>

        <Text style={[styles.description, { color: theme.text }]}>
          {menuItem.description}
        </Text>

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Special Instructions
        </Text>
        <Input
          placeholder="e.g. Extra spicy, no onions, sauce on the side..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <Button
          title={menuItem.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
          disabled={!menuItem.isAvailable}
          onPress={handleAddToCart}
          style={{ marginTop: 20 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  category: {
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    marginTop: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});