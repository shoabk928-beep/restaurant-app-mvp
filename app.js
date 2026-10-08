import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { ReservationScreen } from './src/screens/ReservationScreen';

// Fallback Placeholder Screens for Cart & Profile
const CartScreenPlaceholder = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.centerContainer, { backgroundColor: theme?.background || '#F8F9FA' }]}>
      <Text style={[styles.placeholderText, { color: theme?.text || '#6C757D' }]}>
        Cart Screen
      </Text>
    </View>
  );
};

const ProfileScreenPlaceholder = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.centerContainer, { backgroundColor: theme?.background || '#F8F9FA' }]}>
      <Text style={[styles.placeholderText, { color: theme?.text || '#6C757D' }]}>
        Profile Screen
      </Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main Bottom Tab Navigation Component
function MainTabNavigator() {
  const { theme } = useTheme();
  const { cartItems } = useCart() || { cartItems: [] };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme?.cardBackground || '#FFFFFF',
          elevation: 1,
          shadowOpacity: 0.1,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme?.text || '#212529',
        },
        tabBarStyle: {
          backgroundColor: theme?.cardBackground || '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme?.primary || '#E63946',
        tabBarInactiveTintColor: '#8D99AE',
        tabBarIcon: ({ focused }) => {
          let icon = '🍔';
          if (route.name === 'Book Table') icon = '📅';
          else if (route.name === 'Cart') icon = '🛒';
          else if (route.name === 'Profile') icon = '👤';

          return (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
              {icon}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen
        name="Menu"
        component={HomeScreen}
        options={{ title: 'Menu' }}
      />
      <Tab.Screen
        name="Book Table"
        component={ReservationScreen}
        options={{ title: 'Book Table' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreenPlaceholder}
        options={{
          title: 'Cart',
          tabBarBadge: cartItems && cartItems.length > 0 ? cartItems.length : undefined,
          tabBarBadgeStyle: { backgroundColor: '#E63946', color: '#FFFFFF', fontSize: 10 },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenPlaceholder}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Navigation Wrapper
function AppContent() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={theme?.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme?.background || '#FFFFFF'}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Export
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});