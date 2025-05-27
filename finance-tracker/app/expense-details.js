import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { expenseService } from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ExpenseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      fetchExpenseDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchExpenseDetails = async () => {
    try {
      const data = await expenseService.getExpenseById(id);
      setExpense(data);
    } catch (error) {
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleSave = async () => {
    if (!expense.name || !expense.amount || !expense.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await expenseService.updateExpense(id, expense);
        showToast('Expense updated successfully');
      } else {
        await expenseService.createExpense(expense);
        showToast('Expense created successfully');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseService.deleteExpense(id);
              showToast('Expense deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {id ? 'Edit Expense' : 'Add New Expense'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#6C63FF" />
              <TextInput
                style={styles.input}
                placeholder="Enter expense name"
                placeholderTextColor="#B2BEC3"
                value={expense.name}
                onChangeText={(text) => setExpense({ ...expense, name: text })}
                editable={!saving}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#6C63FF" />
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                placeholderTextColor="#B2BEC3"
                value={expense.amount}
                onChangeText={(text) => setExpense({ ...expense, amount: text })}
                keyboardType="numeric"
                editable={!saving}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.descriptionContainer]}>
              <Ionicons name="document-text-outline" size={20} color="#6C63FF" />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter description"
                placeholderTextColor="#B2BEC3"
                value={expense.description}
                onChangeText={(text) => setExpense({ ...expense, description: text })}
                multiline
                numberOfLines={4}
                editable={!saving}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {id && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
                disabled={saving}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6C63FF',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  placeholder: {
    width: 34,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2D3436',
  },
  descriptionContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 15,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#6C63FF',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonDisabled: {
    backgroundColor: '#B8B8B8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 