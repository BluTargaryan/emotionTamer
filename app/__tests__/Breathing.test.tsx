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
    user: mockUser,
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
import BreathingStageFinal from '../(breathing)/breathingStageFinal';
import BreathingStageHold from '../(breathing)/breathingStageHold';
import BreathingStageOne from '../(breathing)/breathingStageOne';
import BreathingStageTwo from '../(breathing)/breathingStageTwo';
import BreathingStartPage from '../(breathing)/breathingStartPage';

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.MockedFunction<any>;

describe('4-7-8 Breathing Exercise Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAddExerciseHistory.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('BreathingStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText, getByPlaceholderText } = render(<BreathingStartPage />);
      
      expect(getByText('4-7-8 breathing')).toBeTruthy();
      expect(getByText(/Vorem ipsum dolor sit amet/)).toBeTruthy();
      expect(getByPlaceholderText('Set cycles (number of rounds)')).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should show error when trying to start without cycles', () => {
      const { getByTestId, getByText } = render(<BreathingStartPage />);
      
      fireEvent.press(getByTestId('button-start'));
      
      expect(getByText('No number of cycles? Please set the number of cycles to continue')).toBeTruthy();
      expect(router.replace).not.toHaveBeenCalled();
    });

    it('should navigate to stage one with valid cycles', () => {
      const { getByTestId, getByPlaceholderText } = render(<BreathingStartPage />);
      
      fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '3');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageOne?totalCycles=3&currentCycle=1');
    });

    it('should reject invalid cycle input', () => {
      const { getByTestId, getByPlaceholderText } = render(<BreathingStartPage />);
      
      const invalidInputs = ['0', '-1', 'abc', ''];
      
      invalidInputs.forEach(input => {
        jest.clearAllMocks();
        fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), input);
        fireEvent.press(getByTestId('button-start'));
        
        expect(router.replace).not.toHaveBeenCalled();
      });
    });

    it('should hide error message when valid cycles are entered', () => {
      const { getByTestId, getByPlaceholderText, queryByText } = render(<BreathingStartPage />);
      
      // First trigger error
      fireEvent.press(getByTestId('button-start'));
      expect(queryByText('No number of cycles? Please set the number of cycles to continue')).toBeTruthy();
      
      // Then enter valid cycles
      fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '3');
      
      // Error should be hidden
      expect(queryByText('No number of cycles? Please set the number of cycles to continue')).toBeFalsy();
    });
  });

  describe('BreathingStageOne (Inhale - 4 seconds)', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3',
        currentCycle: '1'
      });
    });

    it('should render inhale stage with 4-second countdown', () => {
      const { getByText } = render(<BreathingStageOne />);
      
      expect(getByText('Breathe in')).toBeTruthy();
      expect(getByText('4 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 3')).toBeTruthy();
    });

    it('should countdown from 4 seconds', () => {
      const { getByText } = render(<BreathingStageOne />);
      
      expect(getByText('4 seconds left')).toBeTruthy();
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(getByText('3 seconds left')).toBeTruthy();
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(getByText('2 seconds left')).toBeTruthy();
    });

    it('should navigate to hold stage when countdown reaches 0', async () => {
      render(<BreathingStageOne />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageHold?totalCycles=3&currentCycle=1');
      });
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<BreathingStageOne />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStartPage');
    });
  });

  describe('BreathingStageHold (Hold - 7 seconds)', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });
    });

    it('should render hold stage with 7-second countdown', () => {
      const { getByText } = render(<BreathingStageHold />);
      
      expect(getByText('Hold')).toBeTruthy();
      expect(getByText('7 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 2')).toBeTruthy();
    });

    it('should navigate to exhale stage after 7 seconds', async () => {
      render(<BreathingStageHold />);
      
      act(() => {
        jest.advanceTimersByTime(7000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageTwo?totalCycles=2&currentCycle=1');
      });
    });
  });

  describe('BreathingStageTwo (Exhale - 8 seconds)', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });
    });

    it('should render exhale stage with 8-second countdown', () => {
      const { getByText } = render(<BreathingStageTwo />);
      
      expect(getByText('Breathe out')).toBeTruthy();
      expect(getByText('8 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 2')).toBeTruthy();
    });

    it('should navigate to next cycle when not final cycle', async () => {
      render(<BreathingStageTwo />);
      
      act(() => {
        jest.advanceTimersByTime(8000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageOne?totalCycles=2&currentCycle=2');
      });
    });

    it('should navigate to final stage when final cycle', async () => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '2'
      });

      render(<BreathingStageTwo />);
      
      act(() => {
        jest.advanceTimersByTime(8000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageFinal?totalCycles=2');
      });
    });
  });

  describe('BreathingStageFinal', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3'
      });
    });

    it('should render final stage with completion message', () => {
      const { getByText } = render(<BreathingStageFinal />);
      
      expect(getByText('Well done!')).toBeTruthy();
      expect(getByText(/You have completed 3 cycles/)).toBeTruthy();
    });

    it('should call addExerciseHistory when user is authenticated', async () => {
      render(<BreathingStageFinal />);
      
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: '4-7-8 breathing',
          duration: expect.any(Number),
          cycles: 3,
        });
      });
    });

    it('should navigate to home when done button is pressed', () => {
      const { getByTestId } = render(<BreathingStageFinal />);
      
      fireEvent.press(getByTestId('button-done'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });
  });

  describe('Exercise Flow Integration', () => {
    it('should complete a full 2-cycle exercise flow', async () => {
      // Start page
      mockUseLocalSearchParams.mockReturnValue({});
      const { getByTestId, getByPlaceholderText, rerender } = render(<BreathingStartPage />);
      
             fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '2');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageOne?totalCycles=2&currentCycle=1');
      
      // First cycle - Stage One
      jest.clearAllMocks();
      mockUseLocalSearchParams.mockReturnValue({ totalCycles: '2', currentCycle: '1' });
      rerender(<BreathingStageOne />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageHold?totalCycles=2&currentCycle=1');
      });
      
      // Hold stage
      jest.clearAllMocks();
      rerender(<BreathingStageHold />);
      
      act(() => {
        jest.advanceTimersByTime(7000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageTwo?totalCycles=2&currentCycle=1');
      });
      
      // Exhale stage
      jest.clearAllMocks();
      rerender(<BreathingStageTwo />);
      
      act(() => {
        jest.advanceTimersByTime(8000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(breathing)/breathingStageOne?totalCycles=2&currentCycle=2');
      });
    });
  });
}); 