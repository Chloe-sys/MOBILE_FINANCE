# Finance Tracker Mobile Application

A modern mobile application for tracking personal expenses and managing finances, built with React Native and Expo.

## Features

### Authentication
- Secure login with username/password
- Input validation for all fields
- Error handling and user feedback
- Session management with AsyncStorage

### Dashboard
- Welcome header with user information
- Total expenses overview with statistics
- Quick access to add new expenses
- Search functionality for expenses
- Category-based expense filtering

### Expense Management
- Add new expenses with details
- View expense history
- Search and filter expenses
- Category-based organization
- Amount tracking and calculations

### User Profile
- View user information
- Display username and email
- Secure logout functionality
- Profile data management

## Technical Stack

- **Frontend Framework**: React Native
- **Navigation**: Expo Router
- **State Management**: React Hooks
- **Storage**: AsyncStorage
- **UI Components**: 
  - Expo Vector Icons
  - Linear Gradient
  - Custom styled components
- **API Integration**: RESTful API endpoints

## Project Structure

```
finance-tracker/
├── app/
│   ├── index.js              # Login screen
│   ├── home.js              # Dashboard screen
│   ├── add-expense.js       # Add expense screen
│   ├── profile.js           # User profile screen
│   └── expense-details.js   # Expense details screen
├── src/
│   ├── services/
│   │   └── api.js          # API service functions
│   └── components/         # Reusable components
├── assets/
│   └── images/            # Application images
└── package.json
```

## API Endpoints

### Authentication
```
POST /api/auth/login
- Request: { username, password }
- Response: { user: { id, username, token } }
```

### User Data
```
GET /api/users/:id
- Response: { user: { id, username, firstName, lastName } }
```

### Expenses
```
GET /api/expenses
- Query params: { userId }
- Response: { expenses: [{ id, name, amount, category, description, date }] }

POST /api/expenses
- Request: { name, amount, category, description, date, userId }
- Response: { expense: { id, name, amount, category, description, date } }
```

## Setup Instructions

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn
   - Expo CLI

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Navigate to project directory
   cd finance-tracker

   # Install dependencies
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add necessary environment variables:
     ```
     API_URL=your_api_url
     ```

4. **Running the Application**
   ```bash
   # Start the development server
   npm start
   # or
   yarn start
   ```

## Features Implementation

### Input Validation
- Username validation (3-50 characters)
- Password validation (minimum 6 characters)
- Search query validation
- Expense amount validation

### UI Components
- Custom styled cards
- Gradient backgrounds
- Responsive layouts
- Loading indicators
- Error messages
- Navigation bar

### Data Management
- AsyncStorage for user data
- API integration for expenses
- Real-time updates
- Error handling

## Security Features

- Input sanitization
- Secure password handling
- Token-based authentication
- Error message security


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
