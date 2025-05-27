import axios from 'axios';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  login: async (username) => {
    try {
      const response = await api.get(`/users?username=${username}`);
      if (response.data.length === 0) {
        throw new Error('User not found');
      }
      return response.data[0];
    } catch (error) {
      throw new Error('Failed to login. Please try again.');
    }
  },
};

export const expenseService = {
  getAllExpenses: async () => {
    try {
      const response = await api.get('/expenses');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch expenses');
    }
  },

  getExpenseById: async (id) => {
    try {
      const response = await api.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch expense details');
    }
  },

  createExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', {
        name: expenseData.name,
        amount: expenseData.amount,
        description: expenseData.description,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create expense');
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, {
        name: expenseData.name,
        amount: expenseData.amount,
        description: expenseData.description,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update expense');
    }
  },

  deleteExpense: async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete expense');
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