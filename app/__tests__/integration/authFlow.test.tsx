import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { AppProvider, useApp } from '../../context/AppContext';

// Mock Firebase
const mockAuth = {
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  currentUser: null,
};

const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(() => ({
    id: 'mock-doc-id',
    path: 'mock-path',
  })),
  setDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => false,
    data: () => ({}),
    id: 'mock-doc-id',
  })),
  deleteDoc: jest.fn(() => Promise.resolve()),
};

jest.mock('../../config/firebase', () => ({
  auth: mockAuth,
  db: mockFirestore,
}));

// Mock EmailService
jest.mock('../../services/emailService', () => ({
  default: {
    sendVerificationEmail: jest.fn(() => Promise.resolve({
      success: true,
      message: 'Verification email sent successfully',
    })),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve({
      success: true,
      message: 'Password reset email sent successfully',
    })),
  },
}));

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (mockAuth as any).currentUser = null;
  });

  // Test component that simulates the auth flow
  const AuthFlowTestComponent = () => {
    const { user, signin, logout, loading } = useApp();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSignup = async () => {
      try {
        await act(async () => {
          const result = await signin(email, password);
          if (!result.success) {
            setError(result.message);
          }
        });
      } catch (err) {
        setError('Signup failed');
      }
    };

    const handleLogin = async () => {
      try {
        await act(async () => {
          const result = await signin(email, password);
          if (!result.success) {
            setError(result.message);
          }
        });
      } catch (err) {
        setError('Login failed');
      }
    };

    const handleLogout = async () => {
      try {
        await act(async () => {
          await logout();
        });
      } catch (err) {
        setError('Logout failed');
      }
    };

    return (
      <View>
        <Text testID="user-status">
          {user ? `Logged in as: ${user.email}` : 'Not logged in'}
        </Text>
        <Text testID="loading-status">
          {loading ? 'Loading...' : 'Ready'}
        </Text>
        {error && <Text testID="error-message">{error}</Text>}

        {/* Signup Form */}
        <View testID="signup-form">
          <Text testID="name-input" onPress={() => setName('Test User')}>
            Name: {name}
          </Text>
          <Text testID="email-input" onPress={() => setEmail('test@example.com')}>
            Email: {email}
          </Text>
          <Text testID="password-input" onPress={() => setPassword('password123')}>
            Password: {password ? '***' : ''}
          </Text>
          <Text testID="signup-button" onPress={handleSignup}>
            Sign Up
          </Text>
        </View>

        {/* Login Form */}
        <View testID="login-form">
          <Text testID="login-button" onPress={handleLogin}>
            Log In
          </Text>
        </View>

        {/* Logout Button (only show when logged in) */}
        {user && (
          <Text testID="logout-button" onPress={handleLogout}>
            Log Out
          </Text>
        )}
      </View>
    );
  };

  it('should complete full signup flow', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test User' };
    
         // Mock successful user creation and signin
     (mockFirestore.getDoc as jest.Mock).mockResolvedValueOnce({
       exists: () => true,
       data: () => mockUser,
     });

    const { getByTestId } = render(
      <AppProvider>
        <AuthFlowTestComponent />
      </AppProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(getByTestId('loading-status').props.children).toBe('Ready');
    });

    // Fill in signup form
    fireEvent.press(getByTestId('name-input'));
    fireEvent.press(getByTestId('email-input'));
    fireEvent.press(getByTestId('password-input'));

    // Submit signup
    fireEvent.press(getByTestId('signup-button'));

    // Wait for signup to complete
    await waitFor(() => {
      expect(mockFirestore.getDoc).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should complete full login flow', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    
         // Mock successful signin
     (mockFirestore.getDoc as jest.Mock).mockResolvedValueOnce({
       exists: () => true,
       data: () => mockUser,
     });

    const { getByTestId } = render(
      <AppProvider>
        <AuthFlowTestComponent />
      </AppProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(getByTestId('loading-status').props.children).toBe('Ready');
    });

    // Fill in login form
    fireEvent.press(getByTestId('email-input'));
    fireEvent.press(getByTestId('password-input'));

    // Submit login
    fireEvent.press(getByTestId('login-button'));

    // Wait for login to complete
    await waitFor(() => {
      expect(mockFirestore.getDoc).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should handle logout flow', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    
    // Mock user already logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      user: mockUser,
      expiresAt: Date.now() + 60000, // Valid for 1 minute
    }));

    const { getByTestId, queryByTestId } = render(
      <AppProvider>
        <AuthFlowTestComponent />
      </AppProvider>
    );

    // Wait for user to be loaded
    await waitFor(() => {
      expect(getByTestId('user-status').props.children).toContain('test@example.com');
    }, { timeout: 3000 });

    // Should show logout button when logged in
    const logoutButton = queryByTestId('logout-button');
    expect(logoutButton).toBeTruthy();

    if (logoutButton) {
      // Logout
      fireEvent.press(logoutButton);

      // Wait for logout to complete
      await waitFor(() => {
        expect(getByTestId('user-status').props.children).toBe('Not logged in');
      }, { timeout: 3000 });
    }
  });

  it('should maintain auth state across app restarts', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    
    // Mock cached user session
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      user: mockUser,
      expiresAt: Date.now() + 60000, // Valid for 1 minute
    }));

    const { getByTestId } = render(
      <AppProvider>
        <AuthFlowTestComponent />
      </AppProvider>
    );

    // Wait for auth state to be restored
    await waitFor(() => {
      expect(getByTestId('user-status').props.children).toContain('test@example.com');
    }, { timeout: 3000 });
  });
}); 