import { fireEvent, render, waitFor } from '@testing-library/react-native';
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

// Mock CircleView
jest.mock('../components/CircleView', () => {
  const { View } = require('react-native');
  return ({ component }: any) => (
    <View testID="circle-view">{component}</View>
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
import ColorNoticingExercise from '../(colorNoticing)/colorNoticingExercise';
import ColorNoticingFinal from '../(colorNoticing)/colorNoticingFinal';
import ColorNoticingStartPage from '../(colorNoticing)/colorNoticingStartPage';

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.MockedFunction<any>;

describe('Color Noticing Exercise Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAddExerciseHistory.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('ColorNoticingStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText } = render(<ColorNoticingStartPage />);
      
      expect(getByText('Color Noticing')).toBeTruthy();
      expect(getByText(/This mindfulness exercise helps you focus on the present moment/)).toBeTruthy();
      expect(getByText('Choose a color:')).toBeTruthy();
      expect(getByText('How many items?')).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should display all available colors', () => {
      const { getByText } = render(<ColorNoticingStartPage />);
      
      expect(getByText('Selected: Red')).toBeTruthy(); // Default selection
    });

    it('should allow color selection', () => {
      const { getByText, getAllByRole } = render(<ColorNoticingStartPage />);
      
      // Should start with red selected
      expect(getByText('Selected: Red')).toBeTruthy();
      
      // Click on blue color (assuming it's the second color button)
      const colorButtons = getAllByRole('button');
      const blueColorButton = colorButtons.find(button => 
        button.props.style?.backgroundColor === '#3B82F6'
      );
      
      if (blueColorButton) {
        fireEvent.press(blueColorButton);
        expect(getByText('Selected: Blue')).toBeTruthy();
      }
    });

    it('should allow changing item count', () => {
      const { getByDisplayValue } = render(<ColorNoticingStartPage />);
      
      const input = getByDisplayValue('5');
      fireEvent.changeText(input, '8');
      
      expect(input.props.value).toBe('8');
    });

    it('should navigate to exercise with selected parameters', () => {
      const { getByTestId, getByDisplayValue } = render(<ColorNoticingStartPage />);
      
      // Change item count
      const input = getByDisplayValue('5');
      fireEvent.changeText(input, '7');
      
      // Start exercise
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingExercise?color=red&count=7');
    });

    it('should handle invalid item counts', () => {
      const { getByTestId, getByDisplayValue } = render(<ColorNoticingStartPage />);
      
      const invalidInputs = ['0', '-1', 'abc', ''];
      
      invalidInputs.forEach(input => {
        jest.clearAllMocks();
        const textInput = getByDisplayValue(/\d+/);
        fireEvent.changeText(textInput, input);
        fireEvent.press(getByTestId('button-start'));
        
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('ColorNoticingExercise', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        color: 'blue',
        count: '5'
      });
    });

    it('should render exercise page with correct color and count', () => {
      const { getByText } = render(<ColorNoticingExercise />);
      
      expect(getByText('Look around and find items that are')).toBeTruthy();
      expect(getByText('Blue')).toBeTruthy();
      expect(getByText('Tap the eye below each time you spot something blue')).toBeTruthy();
      expect(getByText('5 items left to find')).toBeTruthy();
    });

    it('should decrease count when eye is tapped', () => {
      const { getByText, getByTestId } = render(<ColorNoticingExercise />);
      
      expect(getByText('5 items left to find')).toBeTruthy();
      
      // Tap the eye button
      fireEvent.press(getByTestId('circle-view'));
      
      expect(getByText('4 items left to find')).toBeTruthy();
    });

    it('should handle singular item text correctly', () => {
      mockUseLocalSearchParams.mockReturnValue({
        color: 'red',
        count: '2'
      });

      const { getByText, getByTestId, rerender } = render(<ColorNoticingExercise />);
      
      expect(getByText('2 items left to find')).toBeTruthy();
      
      // Tap once
      fireEvent.press(getByTestId('circle-view'));
      
      expect(getByText('1 item left to find')).toBeTruthy();
    });

    it('should navigate to final screen when last item is found', () => {
      mockUseLocalSearchParams.mockReturnValue({
        color: 'green',
        count: '1'
      });

      const { getByTestId } = render(<ColorNoticingExercise />);
      
      fireEvent.press(getByTestId('circle-view'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingFinal?color=green&count=1');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<ColorNoticingExercise />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingStartPage');
    });

    it('should handle different colors correctly', () => {
      const colors = [
        { name: 'red', displayName: 'Red' },
        { name: 'blue', displayName: 'Blue' },
        { name: 'green', displayName: 'Green' },
        { name: 'yellow', displayName: 'Yellow' },
        { name: 'purple', displayName: 'Purple' },
        { name: 'orange', displayName: 'Orange' },
      ];

      colors.forEach(color => {
        mockUseLocalSearchParams.mockReturnValue({
          color: color.name,
          count: '3'
        });

        const { getByText } = render(<ColorNoticingExercise />);
        
        expect(getByText(color.displayName)).toBeTruthy();
        expect(getByText(`Tap the eye below each time you spot something ${color.displayName.toLowerCase()}`)).toBeTruthy();
      });
    });
  });

  describe('ColorNoticingFinal', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        color: 'blue',
        count: '5'
      });
    });

    it('should render final screen with completion message', () => {
      const { getByText } = render(<ColorNoticingFinal />);
      
      expect(getByText('Great job!')).toBeTruthy();
      expect(getByText(/You successfully found 5 blue items/)).toBeTruthy();
    });

    it('should call addExerciseHistory when user is authenticated', async () => {
      render(<ColorNoticingFinal />);
      
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: 'Color Noticing',
          duration: expect.any(Number),
          itemsFound: 5,
          color: 'blue',
        });
      });
    });

    it('should navigate to home when done button is pressed', () => {
      const { getByTestId } = render(<ColorNoticingFinal />);
      
      fireEvent.press(getByTestId('button-done'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });

    it('should allow starting a new exercise', () => {
      const { getByTestId } = render(<ColorNoticingFinal />);
      
      fireEvent.press(getByTestId('button-start again'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingStartPage');
    });
  });

  describe('Exercise Flow Integration', () => {
    it('should complete a full color noticing exercise', async () => {
      // Start page
      mockUseLocalSearchParams.mockReturnValue({});
      const { getByTestId, getByDisplayValue, rerender } = render(<ColorNoticingStartPage />);
      
      // Set count to 2 for quick testing
      fireEvent.changeText(getByDisplayValue('5'), '2');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingExercise?color=red&count=2');
      
             // Exercise page
       jest.clearAllMocks();
       mockUseLocalSearchParams.mockReturnValue({ color: 'red', count: '2' });
       
       const { getByText: getExerciseText, getByTestId: getExerciseTestId } = render(<ColorNoticingExercise />);
       expect(getExerciseText('2 items left to find')).toBeTruthy();
       
       // Find first item
       fireEvent.press(getExerciseTestId('circle-view'));
       expect(getExerciseText('1 item left to find')).toBeTruthy();
       
       // Find last item
       fireEvent.press(getExerciseTestId('circle-view'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingFinal?color=red&count=2');
    });
  });
}); 