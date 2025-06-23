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
import FiveFourThreeTwoOneFinal from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneFinal';
import FiveFourThreeTwoOneStageFive from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageFive';
import FiveFourThreeTwoOneStageFour from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageFour';
import FiveFourThreeTwoOneStageOne from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageOne';
import FiveFourThreeTwoOneStageThree from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageThree';
import FiveFourThreeTwoOneStageTwo from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageTwo';
import FiveFourThreeTwoOneStartPage from '../(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage';

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams as jest.MockedFunction<any>;

describe('5-4-3-2-1 Grounding Exercise Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAddExerciseHistory.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('FiveFourThreeTwoOneStartPage', () => {
    it('should render start page with title and description', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStartPage />);
      
      expect(getByText('5-4-3-2-1 method')).toBeTruthy();
      expect(getByText(/Vorem ipsum dolor sit amet/)).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should navigate to stage one when start is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStartPage />);
      
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageOne');
    });
  });

  describe('FiveFourThreeTwoOneStageOne (5 Things You Can See)', () => {
    it('should render stage one with correct instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageOne />);
      
      expect(getByText('Name 5 things you can see')).toBeTruthy();
      expect(getByText('Look around and identify 5 things you can see in your environment')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
    });

    it('should navigate to stage two when continue is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageOne />);
      
      fireEvent.press(getByTestId('button-continue'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageTwo');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageOne />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageTwo (4 Things You Can Touch)', () => {
    it('should render stage two with correct instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageTwo />);
      
      expect(getByText('Name 4 things you can touch')).toBeTruthy();
      expect(getByText('Identify 4 things you can touch around you')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
    });

    it('should navigate to stage three when continue is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageTwo />);
      
      fireEvent.press(getByTestId('button-continue'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageThree');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageTwo />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageThree (3 Things You Can Hear)', () => {
    it('should render stage three with correct instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageThree />);
      
      expect(getByText('Name 3 things you can hear')).toBeTruthy();
      expect(getByText('Listen carefully and identify 3 sounds around you')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
    });

    it('should navigate to stage four when continue is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageThree />);
      
      fireEvent.press(getByTestId('button-continue'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageFour');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageThree />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageFour (2 Things You Can Smell)', () => {
    it('should render stage four with correct instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageFour />);
      
      expect(getByText('Name 2 things you can smell')).toBeTruthy();
      expect(getByText('Take a moment to notice 2 scents around you')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
    });

    it('should navigate to stage five when continue is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFour />);
      
      fireEvent.press(getByTestId('button-continue'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageFive');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFour />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageFive (1 Thing You Can Taste)', () => {
    it('should render stage five with correct instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageFive />);
      
      expect(getByText('Name 1 thing you can taste')).toBeTruthy();
      expect(getByText('Focus on any taste you can detect')).toBeTruthy();
      expect(getByText('Finish')).toBeTruthy();
    });

    it('should navigate to final stage when finish is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFive />);
      
      fireEvent.press(getByTestId('button-finish'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneFinal');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFive />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneFinal', () => {
    it('should render final screen with completion message', () => {
      const { getByText } = render(<FiveFourThreeTwoOneFinal />);
      
      expect(getByText('Excellent work!')).toBeTruthy();
      expect(getByText(/You've successfully completed the 5-4-3-2-1 grounding exercise/)).toBeTruthy();
    });

    it('should call addExerciseHistory when user is authenticated', async () => {
      render(<FiveFourThreeTwoOneFinal />);
      
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: '5-4-3-2-1 Grounding',
          duration: expect.any(Number),
          completed: true,
        });
      });
    });

    it('should navigate to home when done button is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneFinal />);
      
      fireEvent.press(getByTestId('button-done'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });

    it('should allow starting a new exercise', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneFinal />);
      
      fireEvent.press(getByTestId('button-start again'));
      
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
    });
  });

  describe('Exercise Flow Integration', () => {
    it('should complete the full 5-4-3-2-1 exercise flow', () => {
      // Start page
      const { getByTestId, rerender } = render(<FiveFourThreeTwoOneStartPage />);
      
      fireEvent.press(getByTestId('button-start'));
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageOne');
      
      // Stage One
      jest.clearAllMocks();
      rerender(<FiveFourThreeTwoOneStageOne />);
      fireEvent.press(getByTestId('button-continue'));
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageTwo');
      
      // Stage Two
      jest.clearAllMocks();
      rerender(<FiveFourThreeTwoOneStageTwo />);
      fireEvent.press(getByTestId('button-continue'));
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageThree');
      
      // Stage Three
      jest.clearAllMocks();
      rerender(<FiveFourThreeTwoOneStageThree />);
      fireEvent.press(getByTestId('button-continue'));
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageFour');
      
      // Stage Four
      jest.clearAllMocks();
      rerender(<FiveFourThreeTwoOneStageFour />);
      fireEvent.press(getByTestId('button-continue'));
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStageFive');
      
      // Stage Five
      jest.clearAllMocks();
      rerender(<FiveFourThreeTwoOneStageFive />);
      fireEvent.press(getByTestId('button-finish'));
      expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneFinal');
    });

    it('should allow quitting from any stage', () => {
      const stages = [
        FiveFourThreeTwoOneStageOne,
        FiveFourThreeTwoOneStageTwo,
        FiveFourThreeTwoOneStageThree,
        FiveFourThreeTwoOneStageFour,
        FiveFourThreeTwoOneStageFive,
      ];

      stages.forEach(StageComponent => {
        jest.clearAllMocks();
        const { getByTestId } = render(<StageComponent />);
        
        fireEvent.press(getByTestId('button-quit'));
        
        expect(router.replace).toHaveBeenCalledWith('/(FiveFourThreeTwoOne)/FiveFourThreeTwoOneStartPage');
      });
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have consistent button accessibility across all stages', () => {
      const stages = [
        { component: FiveFourThreeTwoOneStageOne, continueButton: 'Continue' },
        { component: FiveFourThreeTwoOneStageTwo, continueButton: 'Continue' },
        { component: FiveFourThreeTwoOneStageThree, continueButton: 'Continue' },
        { component: FiveFourThreeTwoOneStageFour, continueButton: 'Continue' },
        { component: FiveFourThreeTwoOneStageFive, continueButton: 'Finish' },
      ];

      stages.forEach(stage => {
        const { getByText, getByTestId } = render(<stage.component />);
        
        expect(getByText(stage.continueButton)).toBeTruthy();
        expect(getByText('Quit')).toBeTruthy();
        expect(getByTestId(`button-${stage.continueButton.toLowerCase()}`)).toBeTruthy();
        expect(getByTestId('button-quit')).toBeTruthy();
      });
    });

    it('should display appropriate sensory instructions for each stage', () => {
      const stageInstructions = [
        { component: FiveFourThreeTwoOneStageOne, instruction: 'Name 5 things you can see' },
        { component: FiveFourThreeTwoOneStageTwo, instruction: 'Name 4 things you can touch' },
        { component: FiveFourThreeTwoOneStageThree, instruction: 'Name 3 things you can hear' },
        { component: FiveFourThreeTwoOneStageFour, instruction: 'Name 2 things you can smell' },
        { component: FiveFourThreeTwoOneStageFive, instruction: 'Name 1 thing you can taste' },
      ];

      stageInstructions.forEach(stage => {
        const { getByText } = render(<stage.component />);
        expect(getByText(stage.instruction)).toBeTruthy();
      });
    });
  });
}); 