import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React from 'react';
import EmailService from '../../services/emailService';
import { AppProvider, useApp } from '../AppContext';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock EmailService
jest.mock('../../services/emailService', () => ({
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock Firebase config
jest.mock('../../config/firebase', () => ({
  db: {},
}));

const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockEmailService = EmailService as jest.Mocked<typeof EmailService>;

describe('AppContext Authentication Flow', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks - doc function returns different objects based on collection
    mockDoc.mockImplementation((db: any, collection: string, id: string) => {
      return { collection, id } as any;
    });
    
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
    
    // Default mock for any getDoc calls
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as any);
  });

  afterEach(() => {
    // Clean up any remaining timers
    jest.clearAllTimers();
  });

  describe('sendVerificationCode', () => {
    it('should send verification code successfully for new user', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Mock user doesn't exist
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
      } as any);

      // Mock successful email sending
      mockEmailService.sendVerificationEmail.mockResolvedValueOnce({
        success: true,
        message: 'Verification code sent successfully!',
      });

      // Mock setDoc success
      mockSetDoc.mockResolvedValueOnce(undefined);

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('test@example.com');
      });

      expect(response).toEqual({
        success: true,
        message: 'Verification code sent successfully!',
      });

      // Verify verification data was stored
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'test@example.com',
          verified: false,
        })
      );

      // Verify email was sent
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String)
      );
    });

    it('should reject invalid email format', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Wait for initial loadAppData to complete
      await act(async () => {
        jest.runAllTimers();
      });

      // Clear mocks after initial load
      jest.clearAllMocks();

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('invalid-email');
      });

      expect(response).toEqual({
        success: false,
        message: 'Please enter a valid email address',
      });

      expect(mockGetDoc).not.toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('should reject empty email', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('');
      });

      expect(response).toEqual({
        success: false,
        message: 'Please enter your email address',
      });
    });

    it('should reject existing user', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Mock user already exists
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
      } as any);

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('existing@example.com');
      });

      expect(response).toEqual({
        success: false,
        message: 'User with this email already exists',
      });
    });

    it('should clean up verification data if email sending fails', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Mock user doesn't exist
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
      } as any);

      // Mock email sending failure
      mockEmailService.sendVerificationEmail.mockResolvedValueOnce({
        success: false,
        message: 'Email sending failed',
      });

      mockSetDoc.mockResolvedValueOnce(undefined);
      mockDeleteDoc.mockResolvedValueOnce(undefined);

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('test@example.com');
      });

      expect(response).toEqual({
        success: false,
        message: 'Email sending failed',
      });

      // Verify cleanup was called
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });

  describe('verifyCode', () => {
    it('should verify code successfully', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const mockVerificationData = {
        email: 'test@example.com',
        code: '123456',
        timestamp: Date.now(),
        verified: false,
      };

      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockVerificationData,
      } as any);

      mockSetDoc.mockResolvedValueOnce(undefined);

      let response;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response).toEqual({
        success: true,
        message: 'Email verified successfully!',
      });

      // Verify data was marked as verified
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          verified: true,
        })
      );
    });

    it('should reject empty code', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.verifyCode('');
      });

      expect(response).toEqual({
        success: false,
        message: 'Please enter the verification code',
      });
    });

    it('should reject non-existent verification', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
      } as any);

      let response;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response).toEqual({
        success: false,
        message: 'No pending verification found. Please start the signup process again.',
      });
    });

    it('should reject expired code', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const expiredTimestamp = Date.now() - (16 * 60 * 1000); // 16 minutes ago
      const mockVerificationData = {
        email: 'test@example.com',
        code: '123456',
        timestamp: expiredTimestamp,
        verified: false,
      };

      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockVerificationData,
      } as any);

      mockDeleteDoc.mockResolvedValueOnce(undefined);

      let response;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response).toEqual({
        success: false,
        message: 'Verification code has expired. Please start over.',
      });

      // Verify expired data was cleaned up
      expect(mockDeleteDoc).toHaveBeenCalled();
    });

    it('should reject invalid code', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const mockVerificationData = {
        email: 'test@example.com',
        code: '123456',
        timestamp: Date.now(),
        verified: false,
      };

      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockVerificationData,
      } as any);

      let response;
      await act(async () => {
        response = await result.current.verifyCode('654321'); // Wrong code
      });

      expect(response).toEqual({
        success: false,
        message: 'Invalid verification code. Please try again.',
      });
    });
  });

  describe('completeSignup', () => {
    const mockVerificationData = {
      email: 'test@example.com',
      code: '123456',
      timestamp: Date.now(),
      verified: true,
    };

    it('should complete signup successfully', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Setup mocks for the test based on document type
      mockGetDoc.mockImplementation((docRef: any) => {
        // Mock based on document collection/id
        if (docRef.collection === 'sessions') {
          // For loadAppData - no existing session
          return Promise.resolve({
            exists: () => false,
          } as any);
        } else if (docRef.collection === 'verification') {
          // For completeSignup - return verification data
          return Promise.resolve({
            exists: () => true,
            data: () => mockVerificationData,
          } as any);
        }
        // Default fallback
        return Promise.resolve({
          exists: () => false,
        } as any);
      });

      mockSetDoc.mockResolvedValue(undefined);
      mockDeleteDoc.mockResolvedValue(undefined);

      let response;
      await act(async () => {
        response = await result.current.completeSignup('123456', 'password123', 'password123');
      });

      expect(response).toEqual({
        success: true,
        message: 'Account created successfully! Welcome!',
      });

      // Verify user was created
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        })
      );

      // Verify verification data was cleaned up
      expect(mockDeleteDoc).toHaveBeenCalled();

      // Verify user was automatically signed in
      expect(result.current.user).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
        })
      );
    }, 5000);

    it('should reject empty passwords', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.completeSignup('123456', '', 'password123');
      });

      expect(response).toEqual({
        success: false,
        message: 'Please fill in all password fields',
      });
    });

    it('should reject mismatched passwords', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.completeSignup('123456', 'password123', 'password456');
      });

      expect(response).toEqual({
        success: false,
        message: 'Passwords do not match',
      });
    });

    it('should reject short passwords', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.completeSignup('123456', '12345', '12345');
      });

      expect(response).toEqual({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    });

    it('should reject unverified email', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const unverifiedData = {
        ...mockVerificationData,
        verified: false,
      };

      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => unverifiedData,
      } as any);

      let response;
      await act(async () => {
        response = await result.current.completeSignup('123456', 'password123', 'password123');
      });

      expect(response).toEqual({
        success: false,
        message: 'Email not verified. Please verify your email first.',
      });
    });
  });

  describe('signin', () => {
    const mockUserData = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should sign in successfully with correct credentials', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Setup mock for signin based on document type
      mockGetDoc.mockImplementation((docRef: any) => {
        if (docRef.collection === 'sessions') {
          // For loadAppData - no existing session
          return Promise.resolve({
            exists: () => false,
          } as any);
        } else if (docRef.collection === 'users') {
          // For signin - return user data
          return Promise.resolve({
            exists: () => true,
            data: () => mockUserData,
          } as any);
        }
        return Promise.resolve({
          exists: () => false,
        } as any);
      });

      mockSetDoc.mockResolvedValue(undefined);

      let response;
      await act(async () => {
        response = await result.current.signin('test@example.com', 'password123');
      });

      expect(response).toEqual({
        success: true,
        message: 'Successfully signed in!',
      });

      // Verify user was set (without password)
      expect(result.current.user).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
    }, 5000);

    it('should reject empty fields', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.signin('', 'password123');
      });

      expect(response).toEqual({
        success: false,
        message: 'Please fill in all fields',
      });
    });

    it('should reject invalid email format', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.signin('invalid-email', 'password123');
      });

      expect(response).toEqual({
        success: false,
        message: 'Please enter a valid email address',
      });
    });

    it('should reject short password', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      let response;
      await act(async () => {
        response = await result.current.signin('test@example.com', '12345');
      });

      expect(response).toEqual({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    });

    it('should reject non-existent user', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      mockGetDoc
        .mockResolvedValueOnce({
          exists: () => false,
        } as any) // For initial loadAppData
        .mockResolvedValueOnce({
          exists: () => false,
        } as any); // For signin

      let response;
      await act(async () => {
        response = await result.current.signin('nonexistent@example.com', 'password123');
      });

      expect(response).toEqual({
        success: false,
        message: 'No account found with this email. Please sign up first.',
      });
    });

    it('should reject incorrect password', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // Setup mock for signin based on document type
      mockGetDoc.mockImplementation((docRef: any) => {
        if (docRef.collection === 'sessions') {
          // For loadAppData - no existing session
          return Promise.resolve({
            exists: () => false,
          } as any);
        } else if (docRef.collection === 'users') {
          // For signin - return user data
          return Promise.resolve({
            exists: () => true,
            data: () => mockUserData,
          } as any);
        }
        return Promise.resolve({
          exists: () => false,
        } as any);
      });

      let response;
      await act(async () => {
        response = await result.current.signin('test@example.com', 'wrongpassword');
      });

      expect(response).toEqual({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      // First sign in a user
      const mockUserData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      // Setup mock for logout test based on document type
      mockGetDoc.mockImplementation((docRef: any) => {
        if (docRef.collection === 'sessions') {
          // For loadAppData - no existing session
          return Promise.resolve({
            exists: () => false,
          } as any);
        } else if (docRef.collection === 'users') {
          // For signin - return user data
          return Promise.resolve({
            exists: () => true,
            data: () => mockUserData,
          } as any);
        }
        return Promise.resolve({
          exists: () => false,
        } as any);
      });

      mockSetDoc.mockResolvedValue(undefined);
      mockDeleteDoc.mockResolvedValue(undefined);

      await act(async () => {
        await result.current.signin('test@example.com', 'password123');
      });

      expect(result.current.user).not.toBeNull();

      // Now logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(mockDeleteDoc).toHaveBeenCalled();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalled();
    }, 5000);
  });

  describe('password reset flow', () => {
    const mockUserData = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'oldpassword123',
    };

    describe('sendPasswordResetCode', () => {
      it('should send password reset code successfully', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        mockGetDoc.mockResolvedValueOnce({
          exists: () => true,
          data: () => mockUserData,
        } as any);

        mockEmailService.sendPasswordResetEmail.mockResolvedValueOnce({
          success: true,
          message: 'Password reset code sent successfully!',
        });

        mockSetDoc.mockResolvedValueOnce(undefined);

        let response;
        await act(async () => {
          response = await result.current.sendPasswordResetCode('test@example.com');
        });

        expect(response).toEqual({
          success: true,
          message: 'Password reset code sent successfully!',
        });

        expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
          'test@example.com',
          expect.any(String)
        );
      });

      it('should reject non-existent user for password reset', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        mockGetDoc.mockResolvedValueOnce({
          exists: () => false,
        } as any);

        let response;
        await act(async () => {
          response = await result.current.sendPasswordResetCode('nonexistent@example.com');
        });

        expect(response).toEqual({
          success: false,
          message: 'No account found with this email address',
        });
      });
    });

    describe('verifyPasswordResetCode', () => {
      it('should verify password reset code successfully', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        const mockResetData = {
          email: 'test@example.com',
          code: '654321',
          timestamp: Date.now(),
          verified: false,
        };

        mockGetDoc.mockResolvedValueOnce({
          exists: () => true,
          data: () => mockResetData,
        } as any);

        mockSetDoc.mockResolvedValueOnce(undefined);

        let response;
        await act(async () => {
          response = await result.current.verifyPasswordResetCode('654321');
        });

        expect(response).toEqual({
          success: true,
          message: 'Reset code verified successfully!',
        });
      });

      it('should reject expired reset code', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        const expiredResetData = {
          email: 'test@example.com',
          code: '654321',
          timestamp: Date.now() - (16 * 60 * 1000), // 16 minutes ago
          verified: false,
        };

        mockGetDoc.mockResolvedValueOnce({
          exists: () => true,
          data: () => expiredResetData,
        } as any);

        mockDeleteDoc.mockResolvedValueOnce(undefined);

        let response;
        await act(async () => {
          response = await result.current.verifyPasswordResetCode('654321');
        });

        expect(response).toEqual({
          success: false,
          message: 'Reset code has expired. Please start over.',
        });

        expect(mockDeleteDoc).toHaveBeenCalled();
      });
    });

    describe('resetPassword', () => {
      it('should reset password successfully', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        const mockResetData = {
          email: 'test@example.com',
          code: '654321',
          timestamp: Date.now(),
          verified: true,
        };

        // Setup mocks for reset password test based on document type
        mockGetDoc.mockImplementation((docRef: any) => {
          if (docRef.collection === 'sessions') {
            // For loadAppData - no existing session
            return Promise.resolve({
              exists: () => false,
            } as any);
          } else if (docRef.collection === 'passwordReset') {
            // For resetPassword - return reset data
            return Promise.resolve({
              exists: () => true,
              data: () => mockResetData,
            } as any);
          } else if (docRef.collection === 'users') {
            // For resetPassword - return user data
            return Promise.resolve({
              exists: () => true,
              data: () => ({ ...mockUserData }),
            } as any);
          }
          return Promise.resolve({
            exists: () => false,
          } as any);
        });

        mockSetDoc.mockResolvedValue(undefined);
        mockDeleteDoc.mockResolvedValue(undefined);

        let response;
        await act(async () => {
          response = await result.current.resetPassword('654321', 'newpassword123', 'newpassword123');
        });

        expect(response).toEqual({
          success: true,
          message: 'Password reset successfully! Please sign in with your new password.',
        });

        // Verify password was updated
        expect(mockSetDoc).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            password: 'newpassword123',
          })
        );

        // Verify reset data was cleaned up
        expect(mockDeleteDoc).toHaveBeenCalled();
      }, 5000);

      it('should reject unverified reset code', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        const mockResetData = {
          email: 'test@example.com',
          code: '654321',
          timestamp: Date.now(),
          verified: false, // Not verified
        };

        mockGetDoc.mockResolvedValueOnce({
          exists: () => true,
          data: () => mockResetData,
        } as any);

        let response;
        await act(async () => {
          response = await result.current.resetPassword('654321', 'newpassword123', 'newpassword123');
        });

        expect(response).toEqual({
          success: false,
          message: 'Reset code not verified. Please verify your code first.',
        });
      });

      it('should reject mismatched passwords in reset', async () => {
        const { result } = renderHook(() => useApp(), { wrapper });

        let response;
        await act(async () => {
          response = await result.current.resetPassword('654321', 'newpassword123', 'differentpassword');
        });

        expect(response).toEqual({
          success: false,
          message: 'Passwords do not match',
        });
      });
    });
  });

  describe('error handling', () => {
    it('should handle Firebase errors gracefully', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      mockGetDoc.mockRejectedValueOnce(new Error('Firebase error'));

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('test@example.com');
      });

      expect(response).toEqual({
        success: false,
        message: 'An error occurred while sending verification code',
      });
    });

    it('should handle EmailService errors gracefully', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
      } as any);

      mockEmailService.sendVerificationEmail.mockRejectedValueOnce(new Error('Network error'));

      let response;
      await act(async () => {
        response = await result.current.sendVerificationCode('test@example.com');
      });

      expect(response).toEqual({
        success: false,
        message: 'An error occurred while sending verification code',
      });
    });
  });
}); 