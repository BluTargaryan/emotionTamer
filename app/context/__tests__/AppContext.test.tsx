import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { AppProvider, useApp } from '../AppContext';

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

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('provides initial state correctly', async () => {
    // Test component to access context
    const TestComponent = () => {
      const { user, loading } = useApp();
      
      return (
        <View testID="test-component">
          <Text>User: {user ? user.email : 'None'}</Text>
          <Text>Loading: {loading ? 'true' : 'false'}</Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      const testComponent = getByTestId('test-component');
      expect(testComponent.props.children).toEqual([
        expect.objectContaining({ props: { children: ['User: ', 'None'] } }),
        expect.objectContaining({ props: { children: ['Loading: ', 'false'] } }),
      ]);
    });
  });

  it('handles user signin successfully', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test User' };
    
    // Mock successful signin
    (mockFirestore.getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUser,
    });

    const TestSigninComponent = () => {
      const { signin, user, loading } = useApp();
      
      React.useEffect(() => {
        act(() => {
          signin('test@example.com', 'password');
        });
      }, [signin]);

      return (
        <View testID="test-signin">
          <Text>User: {user ? user.email : 'None'}</Text>
          <Text>Loading: {loading ? 'true' : 'false'}</Text>
        </View>
      );
    };

    render(
      <AppProvider>
        <TestSigninComponent />
      </AppProvider>
    );

    // Wait for signin to complete
    await waitFor(() => {
      expect(mockFirestore.getDoc).toHaveBeenCalled();
    });
  });

  it('handles logout correctly', async () => {
    const TestLogoutComponent = () => {
      const { logout } = useApp();
      
      React.useEffect(() => {
        act(() => {
          logout();
        });
      }, [logout]);

      return <View testID="test-logout" />;
    };

    render(
      <AppProvider>
        <TestLogoutComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_session_cache');
    });
  });

  it('loads user session from AsyncStorage', async () => {
    const mockUserSession = { id: 'user123', email: 'test@example.com' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({
      user: mockUserSession,
      expiresAt: Date.now() + 60000, // Valid for 1 minute
    }));

    const TestLoadComponent = () => {
      const { user } = useApp();
      return <View testID="test-load"><Text>{user ? user.email : 'None'}</Text></View>;
    };

    render(
      <AppProvider>
        <TestLoadComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_session_cache');
    });
  });

  it('handles exercise history operations', async () => {
    const mockExerciseData = {
      exerciseName: '4-7-8 Breathing',
      exerciseType: 'breathing',
      date: '2024-01-01',
      duration: 300,
    };

    const TestExerciseComponent = () => {
      const { addExerciseHistory } = useApp();
      
      React.useEffect(() => {
        act(() => {
          addExerciseHistory(mockExerciseData);
        });
      }, [addExerciseHistory]);

      return <View testID="test-exercise" />;
    };

    render(
      <AppProvider>
        <TestExerciseComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(mockFirestore.setDoc).toHaveBeenCalled();
    });
  });

  it('handles errors gracefully', async () => {
    // Mock error scenario
    (mockFirestore.getDoc as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const TestErrorComponent = () => {
      const { signin } = useApp();
      
      React.useEffect(() => {
        act(() => {
          signin('invalid@example.com', 'wrongpassword');
        });
      }, [signin]);

      return <View testID="test-error" />;
    };

    render(
      <AppProvider>
        <TestErrorComponent />
      </AppProvider>
    );

    // Wait for error handling
    await waitFor(() => {
      expect(mockFirestore.getDoc).toHaveBeenCalled();
    });
  });
}); 