import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

// Mock CustomButton
jest.mock('../components/CustomButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, bgColor }: any) => (
    <TouchableOpacity testID={`button-${title.toLowerCase()}`} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// Mock AppContext with proper user state
const mockAddExerciseHistory = jest.fn().mockResolvedValue(undefined);
const mockUser = { id: 'test-user-id', email: 'test@example.com' };

jest.mock('../context/AppContext', () => ({
  useApp: () => ({
    addExerciseHistory: mockAddExerciseHistory,
    user: mockUser, // This ensures addExerciseHistory will be called
    loading: false,
    saveUser: jest.fn(),
    logout: jest.fn(),
    signin: jest.fn(),
    sendVerificationCode: jest.fn(),
    verifyCode: jest.fn(),
    completeSignup: jest.fn(),
    sendPasswordResetCode: jest.fn(),
    verifyPasswordResetCode: jest.fn(),
    resetPassword: jest.fn(),
    getExerciseHistory: jest.fn(),
  }),
}));

// Import components
import AlternateNostrilsStageExhaleLeft from '../(alternateNostrils)/alternateNostrilsStageExhaleLeft';
import AlternateNostrilsStageExhaleRight from '../(alternateNostrils)/alternateNostrilsStageExhaleRight';
import AlternateNostrilsStageFinal from '../(alternateNostrils)/alternateNostrilsStageFinal';
import AlternateNostrilsStageHoldLeft from '../(alternateNostrils)/alternateNostrilsStageHoldLeft';
import AlternateNostrilsStageHoldRight from '../(alternateNostrils)/alternateNostrilsStageHoldRight';
import AlternateNostrilsStageInhaleLeft from '../(alternateNostrils)/alternateNostrilsStageInhaleLeft';
import AlternateNostrilsStageInhaleRight from '../(alternateNostrils)/alternateNostrilsStageInhaleRight';
import AlternateNostrilsStartPage from '../(alternateNostrils)/alternateNostrilsStartPage';

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.MockedFunction<any>;

describe('Alternate Nostril Breathing Exercise Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAddExerciseHistory.mockClear(); // Clear the mock calls
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('AlternateNostrilsStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText, getByPlaceholderText } = render(<AlternateNostrilsStartPage />);
      
      expect(getByText('Alternate Nostril Breathing')).toBeTruthy();
      expect(getByText(/Alternate nostril breathing is a calming breathing technique/)).toBeTruthy();
      expect(getByPlaceholderText('Set cycles (number of rounds)')).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should show error when trying to start without cycles', () => {
      const { getByTestId, getByText } = render(<AlternateNostrilsStartPage />);
      
      fireEvent.press(getByTestId('button-start'));
      
      expect(getByText('Please set the number of cycles to continue')).toBeTruthy();
      expect(router.replace).not.toHaveBeenCalled();
    });

    it('should navigate to left inhale stage with valid cycles', () => {
      const { getByTestId, getByPlaceholderText } = render(<AlternateNostrilsStartPage />);
      
      fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '2');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageInhaleLeft?totalCycles=2&currentCycle=1');
    });

    it('should reject invalid cycle input', () => {
      const { getByTestId, getByPlaceholderText } = render(<AlternateNostrilsStartPage />);
      
      const invalidInputs = ['0', '-1', 'abc', ''];
      
      invalidInputs.forEach(input => {
        jest.clearAllMocks();
        fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), input);
        fireEvent.press(getByTestId('button-start'));
        
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('Left Nostril Flow', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3',
        currentCycle: '1'
      });
    });

    describe('AlternateNostrilsStageInhaleLeft', () => {
      it('should render left inhale stage with 4-second countdown', () => {
        const { getByText } = render(<AlternateNostrilsStageInhaleLeft />);
        
        expect(getByText('Breathe in through left nostril')).toBeTruthy();
        expect(getByText('4 seconds left')).toBeTruthy();
        expect(getByText('Cycle 1 of 3')).toBeTruthy();
      });

      it('should navigate to left hold stage when countdown completes', async () => {
        render(<AlternateNostrilsStageInhaleLeft />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageHoldLeft?totalCycles=3&currentCycle=1');
        });
      });
    });

    describe('AlternateNostrilsStageHoldLeft', () => {
      it('should render left hold stage with 4-second countdown', () => {
        const { getByText } = render(<AlternateNostrilsStageHoldLeft />);
        
        expect(getByText('Hold breath')).toBeTruthy();
        expect(getByText('4 seconds left')).toBeTruthy();
        expect(getByText('Cycle 1 of 3')).toBeTruthy();
      });

      it('should navigate to right exhale stage after 4 seconds', async () => {
        render(<AlternateNostrilsStageHoldLeft />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageExhaleRight?totalCycles=3&currentCycle=1');
        });
      });
    });

    describe('AlternateNostrilsStageExhaleRight', () => {
      it('should render right exhale stage with 4-second countdown', () => {
        const { getByText } = render(<AlternateNostrilsStageExhaleRight />);
        
        expect(getByText('Breathe out through right nostril')).toBeTruthy();
        expect(getByText('4 seconds left')).toBeTruthy();
        expect(getByText('Cycle 1 of 3')).toBeTruthy();
      });

      it('should navigate to right inhale stage after 4 seconds', async () => {
        render(<AlternateNostrilsStageExhaleRight />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageInhaleRight?totalCycles=3&currentCycle=1');
        });
      });
    });
  });

  describe('Right Nostril Flow', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });
    });

    describe('AlternateNostrilsStageInhaleRight', () => {
      it('should render right inhale stage with 4-second countdown', () => {
        const { getByText } = render(<AlternateNostrilsStageInhaleRight />);
        
        expect(getByText('Breathe in through right nostril')).toBeTruthy();
        expect(getByText('4 seconds left')).toBeTruthy();
        expect(getByText('Cycle 1 of 2')).toBeTruthy();
      });

      it('should navigate to right hold stage after 4 seconds', async () => {
        render(<AlternateNostrilsStageInhaleRight />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageHoldRight?totalCycles=2&currentCycle=1');
        });
      });
    });

    describe('AlternateNostrilsStageHoldRight', () => {
      it('should render right hold stage with 4-second countdown', () => {
        const { getByText } = render(<AlternateNostrilsStageHoldRight />);
        
        expect(getByText('Hold breath')).toBeTruthy();
        expect(getByText('4 seconds left')).toBeTruthy();
        expect(getByText('Cycle 1 of 2')).toBeTruthy();
      });

      it('should navigate to left exhale stage after 4 seconds', async () => {
        render(<AlternateNostrilsStageHoldRight />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageExhaleLeft?totalCycles=2&currentCycle=1');
        });
      });
    });

    describe('AlternateNostrilsStageExhaleLeft', () => {
      it('should render left exhale stage with 4-second countdown', () => {
        const { getByText } = render(<AlternateNostrilsStageExhaleLeft />);
        
        expect(getByText('Breathe out through left nostril')).toBeTruthy();
        expect(getByText('4 seconds left')).toBeTruthy();
        expect(getByText('Cycle 1 of 2')).toBeTruthy();
      });

      it('should navigate to next cycle when not finished', async () => {
        render(<AlternateNostrilsStageExhaleLeft />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageInhaleLeft?totalCycles=2&currentCycle=2');
        });
      });

      it('should navigate to final stage when all cycles complete', async () => {
        mockUseLocalSearchParams.mockReturnValue({
          totalCycles: '1',
          currentCycle: '1'
        });

        render(<AlternateNostrilsStageExhaleLeft />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        await waitFor(() => {
          expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageFinal?totalCycles=1');
        });
      });
    });
  });

  describe('AlternateNostrilsStageFinal', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3'
      });
    });

    it('should render completion message with correct cycle count', () => {
      const { getByText } = render(<AlternateNostrilsStageFinal />);
      
      expect(getByText('Congratulations!')).toBeTruthy();
      expect(getByText('You successfully completed')).toBeTruthy();
      expect(getByText('3 cycles')).toBeTruthy();
      expect(getByText('of Alternate Nostril Breathing')).toBeTruthy();
    });

    it('should allow navigation to home', () => {
      const { getByTestId } = render(<AlternateNostrilsStageFinal />);
      
      fireEvent.press(getByTestId('button-back to home'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });

    it('should save exercise history on mount', async () => {
      render(<AlternateNostrilsStageFinal />);
      
      // Wait for the useEffect to complete
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: 'Alternate Nostril Breathing',
          exerciseType: 'Breathing exercise',
          date: expect.any(String),
          duration: 72, // 3 cycles * 24 seconds per cycle
        });
      });
    });
  });

  describe('Complete Alternate Nostril Breathing Flow', () => {
    it('should complete a single cycle correctly', async () => {
      // Start page
      const { getByTestId, getByPlaceholderText } = render(<AlternateNostrilsStartPage />);
      
      fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '1');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageInhaleLeft?totalCycles=1&currentCycle=1');
      
      // Complete the 6-stage cycle
      const stages = [
        { 
          component: AlternateNostrilsStageInhaleLeft, 
          next: '/(alternateNostrils)/alternateNostrilsStageHoldLeft?totalCycles=1&currentCycle=1',
          stage: 'Inhale Left'
        },
        { 
          component: AlternateNostrilsStageHoldLeft, 
          next: '/(alternateNostrils)/alternateNostrilsStageExhaleRight?totalCycles=1&currentCycle=1',
          stage: 'Hold Left'
        },
        { 
          component: AlternateNostrilsStageExhaleRight, 
          next: '/(alternateNostrils)/alternateNostrilsStageInhaleRight?totalCycles=1&currentCycle=1',
          stage: 'Exhale Right'
        },
        { 
          component: AlternateNostrilsStageInhaleRight, 
          next: '/(alternateNostrils)/alternateNostrilsStageHoldRight?totalCycles=1&currentCycle=1',
          stage: 'Inhale Right'
        },
        { 
          component: AlternateNostrilsStageHoldRight, 
          next: '/(alternateNostrils)/alternateNostrilsStageExhaleLeft?totalCycles=1&currentCycle=1',
          stage: 'Hold Right'
        },
        { 
          component: AlternateNostrilsStageExhaleLeft, 
          next: '/(alternateNostrils)/alternateNostrilsStageFinal?totalCycles=1',
          stage: 'Exhale Left (Final)'
        },
      ];

      stages.forEach(({ component: Component, next, stage }) => {
        jest.clearAllMocks();
        mockUseLocalSearchParams.mockReturnValue({
          totalCycles: '1',
          currentCycle: '1'
        });

        render(<Component />);
        
        act(() => {
          jest.advanceTimersByTime(4000);
        });
        
        expect(router.replace).toHaveBeenCalledWith(next);
      });
    });

    it('should complete multiple cycles correctly', async () => {
      // Test 2 cycles
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });

      // First cycle - should continue to cycle 2
      render(<AlternateNostrilsStageExhaleLeft />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageInhaleLeft?totalCycles=2&currentCycle=2');
      });
      
      // Second cycle - should end
      jest.clearAllMocks();
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '2'
      });
      
      render(<AlternateNostrilsStageExhaleLeft />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStageFinal?totalCycles=2');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid search params gracefully', () => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: 'invalid',
        currentCycle: 'invalid'
      });

      const { getByText } = render(<AlternateNostrilsStageInhaleLeft />);
      
      // Should default to safe values
      expect(getByText('Cycle 1 of 1')).toBeTruthy();
    });

    it('should handle missing search params', () => {
      mockUseLocalSearchParams.mockReturnValue({});

      const { getByText } = render(<AlternateNostrilsStageInhaleLeft />);
      
      expect(getByText('Cycle 1 of 1')).toBeTruthy();
    });

    it('should handle timer cleanup on unmount', () => {
      const { unmount } = render(<AlternateNostrilsStageInhaleLeft />);
      
      // Should not throw error when unmounting with active timer
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Quit Functionality', () => {
    it('should allow quitting from any stage', () => {
      const stages = [
        AlternateNostrilsStageInhaleLeft,
        AlternateNostrilsStageHoldLeft,
        AlternateNostrilsStageExhaleRight,
        AlternateNostrilsStageInhaleRight,
        AlternateNostrilsStageHoldRight,
        AlternateNostrilsStageExhaleLeft,
      ];

      stages.forEach((Stage) => {
        jest.clearAllMocks();
        mockUseLocalSearchParams.mockReturnValue({
          totalCycles: '2',
          currentCycle: '1'
        });

        const { getByTestId } = render(<Stage />);
        
        fireEvent.press(getByTestId('button-quit'));
        
        expect(router.replace).toHaveBeenCalledWith('/(alternateNostrils)/alternateNostrilsStartPage');
      });
    });
  });

  describe('Timer Accuracy', () => {
    it('should maintain accurate 4-second countdown across all stages', () => {
      const stages = [
        { Component: AlternateNostrilsStageInhaleLeft, stage: 'Inhale Left' },
        { Component: AlternateNostrilsStageHoldLeft, stage: 'Hold Left' },
        { Component: AlternateNostrilsStageExhaleRight, stage: 'Exhale Right' },
        { Component: AlternateNostrilsStageInhaleRight, stage: 'Inhale Right' },
        { Component: AlternateNostrilsStageHoldRight, stage: 'Hold Right' },
        { Component: AlternateNostrilsStageExhaleLeft, stage: 'Exhale Left' },
      ];

      stages.forEach(({ Component, stage }) => {
        jest.clearAllMocks();
        mockUseLocalSearchParams.mockReturnValue({
          totalCycles: '1',
          currentCycle: '1'
        });

        const { getByText } = render(<Component />);
        
        // Check initial countdown
        expect(getByText('4 seconds left')).toBeTruthy();
        
        // Advance timer and check countdown
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        
        expect(getByText('3 seconds left')).toBeTruthy();
        
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        
        expect(getByText('2 seconds left')).toBeTruthy();
      });
    });
  });

  describe('Cycle Duration Calculation', () => {
    it('should calculate correct duration for exercise history', async () => {
      // Each cycle is 24 seconds: 4s inhale + 4s hold + 4s exhale + 4s inhale + 4s hold + 4s exhale
      const testCases = [
        { cycles: 1, expectedDuration: 24 },
        { cycles: 2, expectedDuration: 48 },
        { cycles: 3, expectedDuration: 72 },
        { cycles: 5, expectedDuration: 120 },
      ];

      for (const { cycles, expectedDuration } of testCases) {
        // Clear previous calls
        mockAddExerciseHistory.mockClear();
        
        mockUseLocalSearchParams.mockReturnValue({
          totalCycles: cycles.toString()
        });

        render(<AlternateNostrilsStageFinal />);
        
        // Wait for the useEffect to complete
        await waitFor(() => {
          expect(mockAddExerciseHistory).toHaveBeenCalledWith(
            expect.objectContaining({
              duration: expectedDuration,
            })
          );
        });
      }
    });
  });
});