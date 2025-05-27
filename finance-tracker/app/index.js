import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { userService } from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    } else if (username.length > 50) {
      newErrors.username = 'Username must be less than 50 characters';
      isValid = false;
    } else if (!/^[a-zA-Z0-9@._-]+$/.test(username)) {
      newErrors.username = 'Username contains invalid characters';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (password.length > 50) {
      newErrors.password = 'Password must be less than 50 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const user = await userService.login(username.trim(), password);
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      // Store user data globally
      global.user = user;
      router.replace('/home');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="wallet" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={errors.username ? '#FF3B30' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.username ? styles.inputError : null]}
                placeholder="Username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors(prev => ({ ...prev, username: '' }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                maxLength={50}
                placeholderTextColor="#999"
              />
            </View>
            {errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={errors.password ? '#FF3B30' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.password ? styles.inputError : null]}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                secureTextEntry
                maxLength={50}
                placeholderTextColor="#999"
              />
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupTextBold: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
  },
}); 