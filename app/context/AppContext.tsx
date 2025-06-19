import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import EmailService from '../services/emailService';

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
  completeSignup: (code: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  sendPasswordResetCode: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyPasswordResetCode: (code: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (code: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
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

const SESSION_CACHE_KEY = 'user_session_cache';
const SESSION_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

const EXERCISE_HISTORY_CACHE_KEY = 'exercise_history_cache';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on app start
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      // 1. Try to load from AsyncStorage cache
      const cache = await AsyncStorage.getItem(SESSION_CACHE_KEY);
      if (cache) {
        const { user: cachedUser, expiresAt } = JSON.parse(cache);
        if (Date.now() < expiresAt) {
          setUser(cachedUser);
          setLoading(false);
          return;
        } else {
          await AsyncStorage.removeItem(SESSION_CACHE_KEY);
        }
      }
      // 2. Fallback to Firestore
      const sessionDoc = await getDoc(doc(db, 'sessions', 'current'));
      if (sessionDoc.exists()) {
        const firestoreUser = sessionDoc.data() as User;
        setUser(firestoreUser);
        // Update cache
        await AsyncStorage.setItem(
          SESSION_CACHE_KEY,
          JSON.stringify({ user: firestoreUser, expiresAt: Date.now() + SESSION_CACHE_DURATION })
        );
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      // Firestore: save user session to 'sessions/current'
      await setDoc(doc(db, 'sessions', 'current'), userData);
      // Cache in AsyncStorage with expiration
      await AsyncStorage.setItem(
        SESSION_CACHE_KEY,
        JSON.stringify({ user: userData, expiresAt: Date.now() + SESSION_CACHE_DURATION })
      );
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
      const existingUsers = await getDoc(doc(db, 'users', email));
      if (existingUsers.exists()) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification data temporarily
      await setDoc(doc(db, 'verification', verificationCode), {
        email: email,
        code: verificationCode,
        timestamp: Date.now(),
        verified: false
      });

      // Send email using the email service
      const emailResult = await EmailService.sendVerificationEmail(email, verificationCode);
      
      if (!emailResult.success) {
        // Clean up verification data if email sending failed
        await deleteDoc(doc(db, 'verification', verificationCode));
        return { success: false, message: emailResult.message };
      }

      return { success: true, message: emailResult.message };
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
      const verificationDoc = await getDoc(doc(db, 'verification', code));
      if (!verificationDoc.exists()) {
        return { success: false, message: 'No pending verification found. Please start the signup process again.' };
      }

      const verificationData = verificationDoc.data() as { email: string; code: string; timestamp: number; verified: boolean };
      
      // Check if code is expired (15 minutes)
      const isExpired = (Date.now() - verificationData.timestamp) > (15 * 60 * 1000);
      if (isExpired) {
        await deleteDoc(doc(db, 'verification', code));
        return { success: false, message: 'Verification code has expired. Please start over.' };
      }

      // Verify the code
      if (code !== verificationData.code) {
        return { success: false, message: 'Invalid verification code. Please try again.' };
      }

      // Mark as verified
      verificationData.verified = true;
      await setDoc(doc(db, 'verification', code), verificationData);

      return { success: true, message: 'Email verified successfully!' };
    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, message: 'An error occurred during verification' };
    }
  };

  const completeSignup = async (code: string, password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
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

      // Get verified email using the verification code
      const verificationDoc = await getDoc(doc(db, 'verification', code));
      if (!verificationDoc.exists()) {
        return { success: false, message: 'No pending verification found. Please start the signup process again.' };
      }

      const verificationData = verificationDoc.data() as { email: string; code: string; timestamp: number; verified: boolean };
      
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
      await setDoc(doc(db, 'users', verificationData.email), userData);

      // Clean up verification data
      await deleteDoc(doc(db, 'verification', code));

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
      const userDoc = await getDoc(doc(db, 'users', email));
      if (!userDoc.exists()) {
        return { success: false, message: 'No account found with this email. Please sign up first.' };
      }

      // Verify password
      const userData = userDoc.data() as UserWithPassword;
      if (userData.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save user session (remove password from session data for security)
      const userSession: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name
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
      // Firestore: remove user session from 'sessions/current'
      await deleteDoc(doc(db, 'sessions', 'current'));
      // Remove cache
      await AsyncStorage.removeItem(SESSION_CACHE_KEY);
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
      const userDoc = await getDoc(doc(db, 'users', email));
      if (!userDoc.exists()) {
        return { success: false, message: 'No account found with this email address' };
      }

      // Generate a reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store reset data temporarily
      await setDoc(doc(db, 'passwordReset', resetCode), {
        email: email,
        code: resetCode,
        timestamp: Date.now(),
        verified: false
      });

      // Send email using the email service
      const emailResult = await EmailService.sendPasswordResetEmail(email, resetCode);
      
      if (!emailResult.success) {
        // Clean up reset data if email sending failed
        await deleteDoc(doc(db, 'passwordReset', resetCode));
        return { success: false, message: emailResult.message };
      }

      return { success: true, message: emailResult.message };
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
      const resetDoc = await getDoc(doc(db, 'passwordReset', code));
      if (!resetDoc.exists()) {
        return { success: false, message: 'No pending password reset found. Please start the process again.' };
      }

      const resetData = resetDoc.data() as { email: string; code: string; timestamp: number; verified: boolean };
      
      // Check if code is expired (15 minutes)
      const isExpired = (Date.now() - resetData.timestamp) > (15 * 60 * 1000);
      if (isExpired) {
        await deleteDoc(doc(db, 'passwordReset', code));
        return { success: false, message: 'Reset code has expired. Please start over.' };
      }

      // Verify the code
      if (code !== resetData.code) {
        return { success: false, message: 'Invalid reset code. Please try again.' };
      }

      // Mark as verified
      resetData.verified = true;
      await setDoc(doc(db, 'passwordReset', code), resetData);

      return { success: true, message: 'Reset code verified successfully!' };
    } catch (error) {
      console.error('Error verifying reset code:', error);
      return { success: false, message: 'An error occurred during verification' };
    }
  };

  const resetPassword = async (code: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
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
      const resetDoc = await getDoc(doc(db, 'passwordReset', code));
      if (!resetDoc.exists()) {
        return { success: false, message: 'No pending password reset found. Please start the process again.' };
      }

      const resetData = resetDoc.data() as { email: string; code: string; timestamp: number; verified: boolean };
      
      if (!resetData.verified) {
        return { success: false, message: 'Reset code not verified. Please verify your code first.' };
      }

      // Update user password in storage (in real app, this would update the backend)
      const userDoc = await getDoc(doc(db, 'users', resetData.email));
      if (!userDoc.exists()) {
        return { success: false, message: 'User not found. Please contact support.' };
      }

      // Update the password (in real app, this would be hashed before storing)
      const userData = userDoc.data() as UserWithPassword;
      userData.password = newPassword;
      
      await setDoc(doc(db, 'users', resetData.email), userData);

      // Clean up reset data
      await deleteDoc(doc(db, 'passwordReset', code));

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

      const newHistory: ExerciseHistory = {
        ...history,
        id: Date.now().toString(),
      };

      // 1. First save to Firebase
      const historyDoc = await getDoc(doc(db, 'history', user.id));
      const historyData = historyDoc.data() as { exercises: ExerciseHistory[] } | undefined;
      const historyArray = historyData?.exercises ? historyData.exercises : [];
      
      historyArray.unshift(newHistory); // Add to beginning of array
      // Wrap array in object for Firestore
      await setDoc(doc(db, 'history', user.id), { exercises: historyArray });

      // 2. Then cache in AsyncStorage for offline access
      const cacheKey = `${EXERCISE_HISTORY_CACHE_KEY}_${user.id}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(historyArray));

    } catch (error) {
      console.error('Error saving exercise history:', error);
      
      // If Firebase fails, try to save to AsyncStorage only as fallback
      try {
        if (user) {
          const cacheKey = `${EXERCISE_HISTORY_CACHE_KEY}_${user.id}`;
          const cachedData = await AsyncStorage.getItem(cacheKey);
          const cachedHistory = cachedData ? JSON.parse(cachedData) as ExerciseHistory[] : [];
          
          const newHistory: ExerciseHistory = {
            ...history,
            id: Date.now().toString(),
          };
          
          cachedHistory.unshift(newHistory);
          await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedHistory));
        }
      } catch (cacheError) {
        console.error('Error saving to cache fallback:', cacheError);
      }
    }
  };

  const getExerciseHistory = async (): Promise<ExerciseHistory[]> => {
    try {
      if (!user) return [];

      const cacheKey = `${EXERCISE_HISTORY_CACHE_KEY}_${user.id}`;

      // 1. First try to get from Firebase
      try {
        const historyDoc = await getDoc(doc(db, 'history', user.id));
        const historyData = historyDoc.data() as { exercises: ExerciseHistory[] } | undefined;
        const firebaseHistory = historyData?.exercises ? historyData.exercises : [];

        // 2. Update AsyncStorage cache with Firebase data
        await AsyncStorage.setItem(cacheKey, JSON.stringify(firebaseHistory));
        
        return firebaseHistory;
      } catch (firebaseError) {
        console.error('Error getting history from Firebase:', firebaseError);
        
        // 3. Fallback to AsyncStorage if Firebase fails
        const cachedData = await AsyncStorage.getItem(cacheKey);
        const cachedHistory = cachedData ? JSON.parse(cachedData) as ExerciseHistory[] : [];
        
        return cachedHistory;
      }
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

export default AppProvider;