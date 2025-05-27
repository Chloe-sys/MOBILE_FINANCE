import axios from 'axios';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

export const userService = {
  login: async (username, password) => {
    try {
      const response = await api.get(`/users?username=${encodeURIComponent(username)}`);
      const user = response.data[0];
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  },
};

export const expenseService = {
  getAllExpenses: async () => {
    try {
      const response = await api.get('/expenses');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
    }
  },

  getExpenseById: async (id) => {
    try {
      const response = await api.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expense');
    }
  },

  createExpense: async (expense) => {
    try {
      const response = await api.post('/expenses', {
        ...expense,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create expense');
    }
  },

  updateExpense: async (id, expense) => {
    try {
      const response = await api.put(`/expenses/${id}`, {
        ...expense,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update expense');
    }
  },

  deleteExpense: async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete expense');
    }
  },

  deleteAllExpenses: async () => {
    try {
      const expenses = await this.getAllExpenses();
      const deletePromises = expenses.map(expense => 
        api.delete(`/expenses/${expense.id}`)
      );
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      throw new Error('Failed to delete all expenses');
    }
  },
}; 