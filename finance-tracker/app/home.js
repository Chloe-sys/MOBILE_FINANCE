import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { expenseService } from '../src/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [userName, setUserName] = useState('');
  const [searchError, setSearchError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchExpenses();
      fetchUserName();
    }, [])
  );

  const fetchUserName = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        const response = await fetch(`https://67ac71475853dfff53dab929.mockapi.io/api/v1/users/${id}`);
        const user = await response.json();
        setUserName(user.username || user.firstName || 'User');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
      const total = data.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    // Clear any previous errors
    setSearchError('');
    
    // Validate search input
    if (text.length > 50) {
      setSearchError('Search query is too long');
      return;
    }

    // Sanitize input to prevent XSS
    const sanitizedText = text.replace(/[<>]/g, '');
    setSearchQuery(sanitizedText);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase().trim();
    const name = expense.name?.toLowerCase() || '';
    const category = expense.category?.toLowerCase() || '';
    const description = expense.description?.toLowerCase() || '';
    const amount = expense.amount?.toString() || '';

    return (
      name.includes(searchLower) ||
      category.includes(searchLower) ||
      description.includes(searchLower) ||
      amount.includes(searchLower)
    );
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#FF6B6B',
      'Transport': '#4ECDC4',
      'Shopping': '#FFD93D',
      'Bills': '#95E1D3',
      'Entertainment': '#FF8B94',
      'Health': '#A8E6CF',
      'Education': '#FFB7B2',
      'Other': '#B5EAD7',
    };
    return colors[category] || '#2E3192';
  };

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => router.push(`/expense-details?id=${item.id}`)}
    >
      <View style={styles.expenseHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(item.category)}20` }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
            {item.category || 'Uncategorized'}
          </Text>
        </View>
        <Text style={styles.amount}>${parseFloat(item.amount || 0).toFixed(2)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={14} color="#666" />
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-expense')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={['#2E3192', '#1BFFFF']}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeHeader}>
                <View style={styles.welcomeIconContainer}>
                  <Ionicons name="wallet" size={24} color="#fff" />
                </View>
                <Text style={styles.welcomeTitle}>Total Expenses</Text>
              </View>
              <Text style={styles.totalAmount}>
                ${totalAmount.toFixed(2)}
              </Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{expenses.length}</Text>
                  <Text style={styles.statLabel}>Expenses</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    ${(totalAmount / (expenses.length || 1)).toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            searchError ? styles.searchInputError : null
          ]}>
            <Ionicons name="search" size={20} color={searchError ? '#FF3B30' : '#2E3192'} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses..."
              value={searchQuery}
              onChangeText={handleSearch}
              maxLength={50}
              placeholderTextColor="#999"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setSearchError('');
              }}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
          {searchError ? (
            <Text style={styles.errorText}>{searchError}</Text>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E3192" />
          </View>
        ) : (
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={48} color="#666" />
                <Text style={styles.emptyText}>No expenses found</Text>
              </View>
            }
          />
        )}
      </View>

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#2E3192" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/add-expense')}
        >
          <Ionicons name="add-circle" size={24} color="#2E3192" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person" size={24} color="#2E3192" />
          <Text style={styles.navText}>Profile</Text>
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
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3192',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E3192',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E3192',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeGradient: {
    padding: 16,
  },
  welcomeContent: {
    width: '100%',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  searchContainer: {
    marginBottom: 16,
    marginHorizontal: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 12,
    color: '#2E3192',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
    paddingVertical: 0,
  },
  listContainer: {
    paddingBottom: 80,
  },
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3192',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navText: {
    fontSize: 11,
    color: '#2E3192',
    marginTop: 2,
    fontWeight: '500',
  },
  searchInputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 