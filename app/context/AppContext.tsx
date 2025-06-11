import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserWithPassword extends User {
  password: string;
}

interface ExerciseHistory {
  id: string;
  exerciseName: string;
  exerciseType: string;
  date: string;
  duration: number; // in seconds
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  saveUser: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  signin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  sendVerificationCode: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyCode: (code: string) => Promise<{ success: boolean; message: string }>;
  completeSignup: (password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  sendPasswordResetCode: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyPasswordResetCode: (code: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  addExerciseHistory: (history: Omit<ExerciseHistory, 'id'>) => Promise<void>;
  getExerciseHistory: () => Promise<ExerciseHistory[]>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on app start
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      
      if (userData) setUser(JSON.parse(userData));
        } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const sendVerificationCode = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Basic validation
      if (!email) {
        return { success: false, message: 'Please enter your email address' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = usersArray.find((u: any) => u.email === email);
      if (userExists) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Generate a verification code (in real app, this would be sent via email service)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification data temporarily
      const verificationData = {
        email: email,
        code: verificationCode,
        timestamp: Date.now(),
        verified: false
      };
      
      await AsyncStorage.setItem('pendingVerification', JSON.stringify(verificationData));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would send this code via email service
      console.log('Verification code for', email, ':', verificationCode);
      
      return { success: true, message: `Verification code sent to ${email}` };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false, message: 'An error occurred while sending verification code' };
    }
  };

  const verifyCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!code) {
        return { success: false, message: 'Please enter the verification code' };
      }

      // Get pending verification data
      const pendingData = await AsyncStorage.getItem('pendingVerification');
      if (!pendingData) {
        return { success: false, message: 'No pending verification found. Please start the signup process again.' };
      }

      const verificationData = JSON.parse(pendingData);
      
      // Check if code is expired (15 minutes)
      const isExpired = (Date.now() - verificationData.timestamp) > (15 * 60 * 1000);
      if (isExpired) {
        await AsyncStorage.removeItem('pendingVerification');
        return { success: false, message: 'Verification code has expired. Please start over.' };
      }

      // Verify the code
      if (code !== verificationData.code) {
        return { success: false, message: 'Invalid verification code. Please try again.' };
      }

      // Mark as verified
      verificationData.verified = true;
      await AsyncStorage.setItem('pendingVerification', JSON.stringify(verificationData));

      return { success: true, message: 'Email verified successfully!' };
    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, message: 'An error occurred during verification' };
    }
  };

  const completeSignup = async (password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate passwords
      if (!password || !confirmPassword) {
        return { success: false, message: 'Please fill in all password fields' };
      }

      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Get verified email
      const pendingData = await AsyncStorage.getItem('pendingVerification');
      if (!pendingData) {
        return { success: false, message: 'No pending verification found. Please start the signup process again.' };
      }

      const verificationData = JSON.parse(pendingData);
      
      if (!verificationData.verified) {
        return { success: false, message: 'Email not verified. Please verify your email first.' };
      }

      // Create user account with password
      const userData: UserWithPassword = {
        id: Date.now().toString(),
        email: verificationData.email,
        name: verificationData.email.split('@')[0],
        password: password
      };

      // Create session user (without password)
      const sessionUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name
      };

      // Add to registered users
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];
      usersArray.push(userData);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(usersArray));

      // Clean up verification data
      await AsyncStorage.removeItem('pendingVerification');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Automatically sign in the user after successful signup
      await saveUser(sessionUser);

      return { success: true, message: 'Account created successfully! Welcome!' };
    } catch (error) {
      console.error('Error completing signup:', error);
      return { success: false, message: 'An error occurred while creating your account' };
    }
  };

  const signin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Basic validation
      if (!email || !password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      // For demo purposes, we'll simulate a successful login with any valid email format
      // In a real app, this would make an API call to your backend
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Check if user exists in registered users
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];
      
      const registeredUser = usersArray.find((u: any) => u.email === email);
      if (!registeredUser) {
        return { success: false, message: 'No account found with this email. Please sign up first.' };
      }

      // Verify password
      if (registeredUser.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save user session (remove password from session data for security)
      const userSession: User = {
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.name
      };
      await saveUser(userSession);
      return { success: true, message: 'Successfully signed in!' };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, message: 'An error occurred during sign in' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const sendPasswordResetCode = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Basic validation
      if (!email) {
        return { success: false, message: 'Please enter your email address' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Check if user exists
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = usersArray.find((u: any) => u.email === email);
      if (!userExists) {
        return { success: false, message: 'No account found with this email address' };
      }

      // Generate a reset code (in real app, this would be sent via email service)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store reset data temporarily
      const resetData = {
        email: email,
        code: resetCode,
        timestamp: Date.now(),
        verified: false
      };
      
      await AsyncStorage.setItem('pendingPasswordReset', JSON.stringify(resetData));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would send this code via email service
      console.log('Password reset code for', email, ':', resetCode);
      
      return { success: true, message: `Password reset code sent to ${email}` };
    } catch (error) {
      console.error('Error sending password reset code:', error);
      return { success: false, message: 'An error occurred while sending reset code' };
    }
  };

  const verifyPasswordResetCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!code) {
        return { success: false, message: 'Please enter the reset code' };
      }

      // Get pending reset data
      const pendingData = await AsyncStorage.getItem('pendingPasswordReset');
      if (!pendingData) {
        return { success: false, message: 'No pending password reset found. Please start the process again.' };
      }

      const resetData = JSON.parse(pendingData);
      
      // Check if code is expired (15 minutes)
      const isExpired = (Date.now() - resetData.timestamp) > (15 * 60 * 1000);
      if (isExpired) {
        await AsyncStorage.removeItem('pendingPasswordReset');
        return { success: false, message: 'Reset code has expired. Please start over.' };
      }

      // Verify the code
      if (code !== resetData.code) {
        return { success: false, message: 'Invalid reset code. Please try again.' };
      }

      // Mark as verified
      resetData.verified = true;
      await AsyncStorage.setItem('pendingPasswordReset', JSON.stringify(resetData));

      return { success: true, message: 'Reset code verified successfully!' };
    } catch (error) {
      console.error('Error verifying reset code:', error);
      return { success: false, message: 'An error occurred during verification' };
    }
  };

  const resetPassword = async (newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate passwords
      if (!newPassword || !confirmPassword) {
        return { success: false, message: 'Please fill in all password fields' };
      }

      if (newPassword !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      if (newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Get verified reset data
      const pendingData = await AsyncStorage.getItem('pendingPasswordReset');
      if (!pendingData) {
        return { success: false, message: 'No pending password reset found. Please start the process again.' };
      }

      const resetData = JSON.parse(pendingData);
      
      if (!resetData.verified) {
        return { success: false, message: 'Reset code not verified. Please verify your code first.' };
      }

      // Update user password in storage (in real app, this would update the backend)
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userIndex = usersArray.findIndex((u: any) => u.email === resetData.email);
      if (userIndex === -1) {
        return { success: false, message: 'User not found. Please contact support.' };
      }

      // Update the password (in real app, this would be hashed before storing)
      usersArray[userIndex].password = newPassword;
      
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(usersArray));

      // Clean up reset data
      await AsyncStorage.removeItem('pendingPasswordReset');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, message: 'Password reset successfully! Please sign in with your new password.' };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, message: 'An error occurred while resetting your password' };
    }
  };

  const addExerciseHistory = async (history: Omit<ExerciseHistory, 'id'>) => {
    try {
      if (!user) return;

      const historyData = await AsyncStorage.getItem(`history_${user.id}`);
      const historyArray = historyData ? JSON.parse(historyData) : [];
      
      const newHistory: ExerciseHistory = {
        ...history,
        id: Date.now().toString(),
      };
      
      historyArray.unshift(newHistory); // Add to beginning of array
      await AsyncStorage.setItem(`history_${user.id}`, JSON.stringify(historyArray));
    } catch (error) {
      console.error('Error saving exercise history:', error);
    }
  };

  const getExerciseHistory = async (): Promise<ExerciseHistory[]> => {
    try {
      if (!user) return [];

      const historyData = await AsyncStorage.getItem(`history_${user.id}`);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      console.error('Error getting exercise history:', error);
      return [];
    }
  };

  const value: AppContextType = {
    user,
    loading,
    saveUser,
    logout,
    signin,
    sendVerificationCode,
    verifyCode,
    completeSignup,
    sendPasswordResetCode,
    verifyPasswordResetCode,
    resetPassword,
    addExerciseHistory,
    getExerciseHistory,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};