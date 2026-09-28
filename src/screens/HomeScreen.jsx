import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { mockMenu, CATEGORIES } from '../data/menu';
import { useDebounce } from '../hooks/useDebounce';
import { MenuItemCard } from '../components/MenuItemCard';
import { Input } from '../components/Input';

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { addItem } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredMenu = useMemo(() => {
    return mockMenu.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, debouncedSearch]);

  const dailySpecials = useMemo(() => {
    return mockMenu.filter((item) => item.isSpecial);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search dishes or ingredients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 0 }}
        />
      </View>

      {/* Category Selector */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip,
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
                    styles.categoryText,
                    { color: isSelected ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Menu List */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onAddToCart={(selectedItem) => addItem(selectedItem)}
            onPress={() =>
              navigation.navigate('ItemDetail', { menuItem: item })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          dailySpecials.length > 0 && selectedCategory === 'All' && !debouncedSearch ? (
            <View style={styles.specialsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Today's Specials 🔥
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              No items found matching your criteria.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  categoriesWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  specialsSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});