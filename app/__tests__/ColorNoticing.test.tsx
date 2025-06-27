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
  return ({ title, onPress }: any) => (
    <TouchableOpacity testID={`button-${title.toLowerCase().replace(/\s+/g, '-')}`} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// Mock CircleView with proper TouchableOpacity wrapper
jest.mock('../components/CircleView', () => {
  const { TouchableOpacity, View } = require('react-native');
  return ({ component }: any) => (
    <TouchableOpacity testID="circle-touchable">
      <View testID="circle-view">{component}</View>
    </TouchableOpacity>
  );
});

// Mock AppContext
const mockAddExerciseHistory = jest.fn().mockResolvedValue(undefined);
jest.mock('../context/AppContext', () => ({
  useApp: () => ({
    addExerciseHistory: mockAddExerciseHistory,
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false,
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
    mockAddExerciseHistory.mockClear();
  });

  describe('ColorNoticingStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText } = render(<ColorNoticingStartPage />);
      
      expect(getByText('Color Noticing')).toBeTruthy();
      expect(getByText(/This mindfulness exercise helps you focus on the present moment by noticing colors around you/)).toBeTruthy();
      expect(getByText('Choose a color:')).toBeTruthy();
      expect(getByText('How many items?')).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should display default color selection', () => {
      const { getByText } = render(<ColorNoticingStartPage />);
      expect(getByText('Selected: Red')).toBeTruthy();
    });

    it('should allow changing item count', () => {
      const { getByDisplayValue } = render(<ColorNoticingStartPage />);
      
      const input = getByDisplayValue('5');
      fireEvent.changeText(input, '8');
      
      expect(input.props.value).toBe('8');
    });

    it('should navigate to exercise with selected parameters', () => {
      const { getByTestId, getByDisplayValue } = render(<ColorNoticingStartPage />);
      
      const input = getByDisplayValue('5');
      fireEvent.changeText(input, '7');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingExercise?color=red&count=7');
    });

    it('should handle invalid item counts', () => {
      const invalidInputs = ['0', '-1', 'abc', ''];
      
      invalidInputs.forEach(input => {
        jest.clearAllMocks();
        const { getByTestId, getByDisplayValue } = render(<ColorNoticingStartPage />);
        const textInput = getByDisplayValue('5');
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
      
      fireEvent.press(getByTestId('circle-touchable'));
      
      expect(getByText('4 items left to find')).toBeTruthy();
    });

    it('should navigate to final screen when last item is found', () => {
      mockUseLocalSearchParams.mockReturnValue({
        color: 'green',
        count: '1'
      });

      const { getByTestId } = render(<ColorNoticingExercise />);
      
      fireEvent.press(getByTestId('circle-touchable'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingFinal?color=green&count=1');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<ColorNoticingExercise />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(colorNoticing)/colorNoticingStartPage');
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
      
      expect(getByText('Congratulations!')).toBeTruthy();
      expect(getByText('You successfully found')).toBeTruthy();
      expect(getByText('5 blue')).toBeTruthy();
      expect(getByText('items around you')).toBeTruthy();
      expect(getByText('Great job staying present and mindful!')).toBeTruthy();
    });

    it('should call addExerciseHistory with correct data structure', async () => {
      render(<ColorNoticingFinal />);
      
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: 'Color Noticing',
          exerciseType: 'Mindfulness exercise',
          date: expect.any(String),
          duration: 150,
        });
      });
    });

    it('should navigate to home when back to home button is pressed', () => {
      const { getByTestId } = render(<ColorNoticingFinal />);
      
      fireEvent.press(getByTestId('button-back-to-home'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });
  });
}); 