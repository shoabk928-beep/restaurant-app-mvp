import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

export const MenuItemCard = ({ item, onAddToCart, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.isSpecial && (
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Text style={styles.badgeText}>Special</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.description, { color: theme.subText }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.footerRow}>
          <Text style={[styles.price, { color: theme.primary }]}>
            ${item.price.toFixed(2)}
          </Text>

          <Button
            title={item.isAvailable ? 'Add' : 'Out of Stock'}
            size="small"
            disabled={!item.isAvailable}
            onPress={() => onAddToCart && onAddToCart(item)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  description: {
    fontSize: 12,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});