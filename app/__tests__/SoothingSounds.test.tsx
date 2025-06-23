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

// Mock Audio from expo-av
const mockAudioObject = {
  loadAsync: jest.fn().mockResolvedValue({}),
  playAsync: jest.fn().mockResolvedValue({}),
  pauseAsync: jest.fn().mockResolvedValue({}),
  stopAsync: jest.fn().mockResolvedValue({}),
  unloadAsync: jest.fn().mockResolvedValue({}),
  setIsLoopingAsync: jest.fn().mockResolvedValue({}),
  getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true, isPlaying: false }),
};

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue([mockAudioObject, {}]),
    },
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
  },
}));

// Import components
import SoothingSoundsFinal from '../(soothingSounds)/soothingSoundsFinal';
import SoothingSoundsPlay from '../(soothingSounds)/soothingSoundsPlay';
import SoothingSoundsStartPage from '../(soothingSounds)/soothingSoundsStartPage';

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.MockedFunction<any>;

describe('Soothing Sounds Exercise Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAddExerciseHistory.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('SoothingSoundsStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText } = render(<SoothingSoundsStartPage />);
      
      expect(getByText('Soothing Sounds')).toBeTruthy();
      expect(getByText(/Relax and unwind with calming white noise/)).toBeTruthy();
      expect(getByText('How many minutes?')).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should have default time set to 5 minutes', () => {
      const { getByDisplayValue } = render(<SoothingSoundsStartPage />);
      
      expect(getByDisplayValue('5')).toBeTruthy();
    });

    it('should allow changing the duration', () => {
      const { getByDisplayValue } = render(<SoothingSoundsStartPage />);
      
      const input = getByDisplayValue('5');
      fireEvent.changeText(input, '10');
      
      expect(input.props.value).toBe('10');
    });

    it('should navigate to play screen with valid minutes', () => {
      const { getByTestId, getByDisplayValue } = render(<SoothingSoundsStartPage />);
      
      const input = getByDisplayValue('5');
      fireEvent.changeText(input, '8');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(soothingSounds)/soothingSoundsPlay?minutes=8');
    });

    it('should handle invalid minute input', () => {
      const { getByTestId, getByDisplayValue } = render(<SoothingSoundsStartPage />);
      
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

  describe('SoothingSoundsPlay', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        minutes: '5'
      });
    });

    it('should render play screen with correct timer', () => {
      const { getByText } = render(<SoothingSoundsPlay />);
      
      expect(getByText('5:00')).toBeTruthy();
      expect(getByText('Soothing Sounds')).toBeTruthy();
    });

    it('should display play button initially', () => {
      const { getByTestId } = render(<SoothingSoundsPlay />);
      
      expect(getByTestId('button-play')).toBeTruthy();
    });

    it('should start playing when play button is pressed', async () => {
      const { getByTestId } = render(<SoothingSoundsPlay />);
      
      fireEvent.press(getByTestId('button-play'));
      
      await waitFor(() => {
        expect(mockAudioObject.playAsync).toHaveBeenCalled();
      });
    });

    it('should show pause button when playing', async () => {
      const { getByTestId, queryByTestId } = render(<SoothingSoundsPlay />);
      
      fireEvent.press(getByTestId('button-play'));
      
      await waitFor(() => {
        expect(queryByTestId('button-pause')).toBeTruthy();
        expect(queryByTestId('button-play')).toBeFalsy();
      });
    });

    it('should pause when pause button is pressed', async () => {
      const { getByTestId } = render(<SoothingSoundsPlay />);
      
      // Start playing first
      fireEvent.press(getByTestId('button-play'));
      
      await waitFor(() => {
        expect(getByTestId('button-pause')).toBeTruthy();
      });
      
      // Then pause
      fireEvent.press(getByTestId('button-pause'));
      
      await waitFor(() => {
        expect(mockAudioObject.pauseAsync).toHaveBeenCalled();
      });
    });

    it('should countdown timer when playing', () => {
      const { getByText } = render(<SoothingSoundsPlay />);
      
      expect(getByText('5:00')).toBeTruthy();
      
      act(() => {
        jest.advanceTimersByTime(60000); // 1 minute
      });
      
      expect(getByText('4:00')).toBeTruthy();
    });

    it('should navigate to final screen when timer completes', async () => {
      mockUseLocalSearchParams.mockReturnValue({
        minutes: '1' // 1 minute for quick testing
      });

      render(<SoothingSoundsPlay />);
      
      act(() => {
        jest.advanceTimersByTime(60000); // 1 minute
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(soothingSounds)/soothingSoundsFinal?minutes=1');
      });
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<SoothingSoundsPlay />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(soothingSounds)/soothingSoundsStartPage');
    });

    it('should stop audio when quitting', async () => {
      const { getByTestId } = render(<SoothingSoundsPlay />);
      
      // Start playing first
      fireEvent.press(getByTestId('button-play'));
      
      await waitFor(() => {
        expect(mockAudioObject.playAsync).toHaveBeenCalled();
      });
      
      // Then quit
      fireEvent.press(getByTestId('button-quit'));
      
      await waitFor(() => {
        expect(mockAudioObject.stopAsync).toHaveBeenCalled();
      });
    });
  });

  describe('SoothingSoundsFinal', () => {
    beforeEach(() => {
      mockUseLocalSearchParams.mockReturnValue({
        minutes: '5'
      });
    });

    it('should render final screen with completion message', () => {
      const { getByText } = render(<SoothingSoundsFinal />);
      
      expect(getByText('Session Complete')).toBeTruthy();
      expect(getByText(/You enjoyed 5 minutes of soothing sounds/)).toBeTruthy();
    });

    it('should call addExerciseHistory when user is authenticated', async () => {
      render(<SoothingSoundsFinal />);
      
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: 'Soothing Sounds',
          duration: 5 * 60 * 1000, // 5 minutes in milliseconds
          minutes: 5,
        });
      });
    });

    it('should navigate to home when done button is pressed', () => {
      const { getByTestId } = render(<SoothingSoundsFinal />);
      
      fireEvent.press(getByTestId('button-done'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });

    it('should allow starting a new session', () => {
      const { getByTestId } = render(<SoothingSoundsFinal />);
      
      fireEvent.press(getByTestId('button-start again'));
      
      expect(router.replace).toHaveBeenCalledWith('/(soothingSounds)/soothingSoundsStartPage');
    });
  });

  describe('Exercise Flow Integration', () => {
    it('should complete a full soothing sounds session', async () => {
      // Start page
      mockUseLocalSearchParams.mockReturnValue({});
      const { getByTestId, getByDisplayValue } = render(<SoothingSoundsStartPage />);
      
      // Set duration to 1 minute for quick testing
      fireEvent.changeText(getByDisplayValue('5'), '1');
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('/(soothingSounds)/soothingSoundsPlay?minutes=1');
      
      // Play screen
      jest.clearAllMocks();
      mockUseLocalSearchParams.mockReturnValue({ minutes: '1' });
      const { getByTestId: getPlayTestId } = render(<SoothingSoundsPlay />);
      
      // Start playing
      fireEvent.press(getPlayTestId('button-play'));
      
      await waitFor(() => {
        expect(mockAudioObject.playAsync).toHaveBeenCalled();
      });
      
      // Fast forward time to complete session
      act(() => {
        jest.advanceTimersByTime(60000); // 1 minute
      });
      
      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/(soothingSounds)/soothingSoundsFinal?minutes=1');
      });
    });

    it('should handle audio loading errors gracefully', async () => {
      mockAudioObject.loadAsync.mockRejectedValueOnce(new Error('Audio load failed'));
      
      const { getByTestId } = render(<SoothingSoundsPlay />);
      
      fireEvent.press(getByTestId('button-play'));
      
      // Should not crash the app
      await waitFor(() => {
        expect(mockAudioObject.loadAsync).toHaveBeenCalled();
      });
    });
  });

  describe('Audio Management', () => {
    it('should clean up audio when component unmounts', async () => {
      const { getByTestId, unmount } = render(<SoothingSoundsPlay />);
      
      // Start playing
      fireEvent.press(getByTestId('button-play'));
      
      await waitFor(() => {
        expect(mockAudioObject.playAsync).toHaveBeenCalled();
      });
      
      // Unmount component
      unmount();
      
      await waitFor(() => {
        expect(mockAudioObject.unloadAsync).toHaveBeenCalled();
      });
    });

    it('should handle different timer durations correctly', () => {
      const durations = [1, 5, 10, 15, 30];
      
      durations.forEach(minutes => {
        mockUseLocalSearchParams.mockReturnValue({
          minutes: minutes.toString()
        });

        const { getByText } = render(<SoothingSoundsPlay />);
        
        const expectedTime = `${minutes}:00`;
        expect(getByText(expectedTime)).toBeTruthy();
      });
    });
  });
}); 