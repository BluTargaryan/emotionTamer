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

// Mock AppContext
jest.mock('../context/AppContext', () => ({
  useApp: () => ({
    addExerciseHistory: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Import components
import BoxStageExhale from '../(box)/boxStageExhale';
import BoxStageFinal from '../(box)/boxStageFinal';
import BoxStageHold from '../(box)/boxStageHold';
import BoxStageHoldFinal from '../(box)/boxStageHoldFinal';
import BoxStageOne from '../(box)/boxStageOne';
import BoxStartPage from '../(box)/boxStartPage';

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.MockedFunction<any>;

describe('Box Breathing Exercise Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('BoxStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText, getByPlaceholderText } = render(<BoxStartPage />);
      
      expect(getByText('Box Breathing')).toBeTruthy();
      expect(getByText(/Box breathing is a powerful stress management technique/)).toBeTruthy();
      expect(getByPlaceholderText('Set cycles (number of rounds)')).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should show error when trying to start without cycles', () => {
      const { getByTestId, getByText } = render(<BoxStartPage />);
      
      fireEvent.press(getByTestId('button-start'));
      
      expect(getByText('Please set the number of cycles to continue')).toBeTruthy();
      expect(router.replace).not.toHaveBeenCalled();
    });

    it('should navigate to stage one with valid cycles', () => {
      const { getByTestId, getByPlaceholderText } = render(<BoxStartPage />);
      
      fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '3');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageOne?totalCycles=3&currentCycle=1');
    });

    it('should reject invalid cycle input', () => {
      const { getByTestId, getByPlaceholderText } = render(<BoxStartPage />);
      
      const invalidInputs = ['0', '-1', 'abc', ''];
      
      invalidInputs.forEach(input => {
        jest.clearAllMocks();
        fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), input);
        fireEvent.press(getByTestId('button-start'));
        
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('BoxStageOne (Inhale)', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3',
        currentCycle: '1'
      });
    });

    it('should render inhale stage with 4-second countdown', () => {
      const { getByText } = render(<BoxStageOne />);
      
      expect(getByText('Breathe in')).toBeTruthy();
      expect(getByText('4 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 3')).toBeTruthy();
    });

    it('should countdown from 4 seconds', () => {
      const { getByText } = render(<BoxStageOne />);
      
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
      render(<BoxStageOne />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageHold?totalCycles=3&currentCycle=1');
      });
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<BoxStageOne />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(box)/boxStartPage');
    });
  });

  describe('BoxStageHold', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });
    });

    it('should render hold stage with 4-second countdown', () => {
      const { getByText } = render(<BoxStageHold />);
      
      expect(getByText('Hold')).toBeTruthy();
      expect(getByText('4 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 2')).toBeTruthy();
    });

    it('should navigate to exhale stage after 4 seconds', async () => {
      render(<BoxStageHold />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageExhale?totalCycles=2&currentCycle=1');
      });
    });
  });

  describe('BoxStageExhale', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });
    });

    it('should render exhale stage with 4-second countdown', () => {
      const { getByText } = render(<BoxStageExhale />);
      
      expect(getByText('Breathe out')).toBeTruthy();
      expect(getByText('4 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 2')).toBeTruthy();
    });

    it('should navigate to final hold stage after 4 seconds', async () => {
      render(<BoxStageExhale />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageHoldFinal?totalCycles=2&currentCycle=1');
      });
    });
  });

  describe('BoxStageHoldFinal', () => {
    it('should render final hold stage with 4-second countdown', () => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });

      const { getByText } = render(<BoxStageHoldFinal />);
      
      expect(getByText('Hold')).toBeTruthy();
      expect(getByText('4 seconds left')).toBeTruthy();
      expect(getByText('Cycle 1 of 2')).toBeTruthy();
    });

    it('should navigate to next cycle when not finished', async () => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3',
        currentCycle: '2'
      });

      render(<BoxStageHoldFinal />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageOne?totalCycles=3&currentCycle=3');
      });
    });

    it('should navigate to final stage when all cycles complete', async () => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '1',
        currentCycle: '1'
      });

      render(<BoxStageHoldFinal />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageFinal?totalCycles=1');
      });
    });
  });

  describe('BoxStageFinal', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '3'
      });
    });

    it('should render completion message with correct cycle count', () => {
      const { getByText } = render(<BoxStageFinal />);
      
      expect(getByText('Congratulations!')).toBeTruthy();
      expect(getByText('You successfully completed')).toBeTruthy();
      expect(getByText('3 cycles')).toBeTruthy();
      expect(getByText('of box breathing')).toBeTruthy();
    });

    it('should allow navigation to home', () => {
      const { getByTestId } = render(<BoxStageFinal />);
      
      fireEvent.press(getByTestId('button-to home'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });
  });

  describe('Complete Box Breathing Flow', () => {
    it('should complete a single cycle correctly', async () => {
      // Start page
      const { getByTestId, getByPlaceholderText } = render(<BoxStartPage />);
      
      fireEvent.changeText(getByPlaceholderText('Set cycles (number of rounds)'), '1');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageOne?totalCycles=1&currentCycle=1');
      
      // Stage One (Inhale) - 4 seconds
      jest.clearAllMocks();
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '1',
        currentCycle: '1'
      });
      
      render(<BoxStageOne />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageHold?totalCycles=1&currentCycle=1');
      });
      
      // Stage Hold - 4 seconds
      jest.clearAllMocks();
      render(<BoxStageHold />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageExhale?totalCycles=1&currentCycle=1');
      });
      
      // Stage Exhale - 4 seconds
      jest.clearAllMocks();
      render(<BoxStageExhale />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageHoldFinal?totalCycles=1&currentCycle=1');
      });
      
      // Stage Hold Final - 4 seconds, should end
      jest.clearAllMocks();
      render(<BoxStageHoldFinal />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageFinal?totalCycles=1');
      });
    });

    it('should complete multiple cycles correctly', async () => {
      // Test 2 cycles
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '1'
      });

      // First cycle - should continue to cycle 2
      render(<BoxStageHoldFinal />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageOne?totalCycles=2&currentCycle=2');
      });
      
      // Second cycle - should end
      jest.clearAllMocks();
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: '2',
        currentCycle: '2'
      });
      
      render(<BoxStageHoldFinal />);
      
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStageFinal?totalCycles=2');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid search params gracefully', () => {
      mockUseLocalSearchParams.mockReturnValue({
        totalCycles: 'invalid',
        currentCycle: 'invalid'
      });

      const { getByText } = render(<BoxStageOne />);
      
      // Should default to safe values
      expect(getByText('Cycle 1 of 1')).toBeTruthy();
    });

    it('should handle missing search params', () => {
      mockUseLocalSearchParams.mockReturnValue({});

      const { getByText } = render(<BoxStageOne />);
      
      expect(getByText('Cycle 1 of 1')).toBeTruthy();
    });

    it('should handle timer cleanup on unmount', () => {
      const { unmount } = render(<BoxStageOne />);
      
      // Should not throw error when unmounting with active timer
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Quit Functionality', () => {
    it('should allow quitting from any stage', () => {
      const stages = [
        BoxStageOne,
        BoxStageHold,
        BoxStageExhale,
        BoxStageHoldFinal,
      ];

      stages.forEach((Stage) => {
        jest.clearAllMocks();
        mockUseLocalSearchParams.mockReturnValue({
          totalCycles: '2',
          currentCycle: '1'
        });

        const { getByTestId } = render(<Stage />);
        
        fireEvent.press(getByTestId('button-quit'));
        
        expect(router.replace).toHaveBeenCalledWith('/(box)/boxStartPage');
      });
    });
  });
});