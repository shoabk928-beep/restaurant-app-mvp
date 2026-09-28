import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { mockUsers } from '../data/users';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validate
  );

  const handleLogin = (formValues) => {
    const foundUser = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === formValues.email.toLowerCase() &&
        u.password === formValues.password
    );

    if (foundUser) {
      login(foundUser);
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>
          Restaurant MVP
        </Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Sign in to continue
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="e.g. customer@example.com"
          value={values.email}
          onChangeText={(text) => handleChange('email', text)}
          error={errors.email}
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="Enter password"
          value={values.password}
          onChangeText={(text) => handleChange('password', text)}
          error={errors.password}
          secureTextEntry
        />

        <Button
          title="Sign In"
          onPress={() => handleSubmit(handleLogin)}
          style={{ marginTop: 10 }}
        />
      </View>

      <View style={styles.hintBox}>
        <Text style={[styles.hintTitle, { color: theme.text }]}>
          Demo Credentials:
        </Text>
        <Text style={[styles.hintText, { color: theme.subText }]}>
          Customer: customer@example.com / password123
        </Text>
        <Text style={[styles.hintText, { color: theme.subText }]}>
          Manager: manager@example.com / password123
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
  },
  form: {
    width: '100%',
  },
  hintBox: {
    marginTop: 30,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  hintTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 12,
    marginTop: 2,
  },
});