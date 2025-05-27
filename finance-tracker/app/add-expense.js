import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { expenseService } from '../src/services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddExpenseScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSave = async () => {
    if (!expense.name || !expense.amount || !expense.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await expenseService.createExpense(expense);
      Alert.alert('Success', 'Expense added successfully', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2E3192" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Expense</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={expense.name}
              onChangeText={(text) => setExpense({ ...expense, name: text })}
              placeholder="Enter expense name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={expense.amount}
              onChangeText={(text) => setExpense({ ...expense, amount: text })}
              placeholder="Enter amount"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              value={expense.category}
              onChangeText={(text) => setExpense({ ...expense, category: text })}
              placeholder="Enter category"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={expense.date}
              onChangeText={(text) => setExpense({ ...expense, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={expense.description}
              onChangeText={(text) => setExpense({ ...expense, description: text })}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Add Expense</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3192',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3192',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#2E3192',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2E3192',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}); 