import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { expenseService } from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleDeleteExpense = async (id) => {
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
              setExpenses(expenses.filter(expense => expense.id !== id));
              showToast('Expense deleted successfully');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() => router.push(`/expense-details?id=${item.id}`)}
    >
      <View style={styles.expenseContent}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseTitle}>{item.name}</Text>
          <Text style={styles.expenseAmount}>${item.amount}</Text>
        </View>
        
        <Text style={styles.expenseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.expenseFooter}>
          <Text style={styles.expenseDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteExpense(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Expenses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/expense-details')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#B8B8B8" />
            <Text style={styles.emptyText}>No expenses found</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => router.push('/expense-details')}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Expense</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#6C63FF',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContainer: {
    padding: 15,
  },
  expenseItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  expenseContent: {
    padding: 15,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    flex: 1,
    marginRight: 10,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  expenseDescription: {
    color: '#636E72',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F2F6',
    paddingTop: 12,
  },
  expenseDate: {
    color: '#B2BEC3',
    fontSize: 12,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#B2BEC3',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 