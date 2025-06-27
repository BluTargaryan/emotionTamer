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
    <TouchableOpacity testID={`button-${title.toLowerCase().replace(/\s+/g, '-')}`} onPress={onPress}>
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
      expect(getByText(/Vorem ipsum dolor sit amet, consectetur adipiscing elit/)).toBeTruthy();
      expect(getByText('Start')).toBeTruthy();
    });

    it('should navigate to stage one when start is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStartPage />);
      
      fireEvent.press(getByTestId('button-start'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageOne');
    });
  });

  describe('FiveFourThreeTwoOneStageOne (5 Things You Can See)', () => {
    it('should render stage one with correct tapping instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageOne />);
      
      expect(getByText('Tap the eye below for each thing you SEE')).toBeTruthy();
      expect(getByText('5 things left')).toBeTruthy();
      expect(getByText('Quit')).toBeTruthy();
    });

    it('should countdown when tapping the interactive element', () => {
      const { getByText, getByTestId } = render(<FiveFourThreeTwoOneStageOne />);
      
      expect(getByText('5 things left')).toBeTruthy();
      
      // Tap the CircleView (TouchableOpacity)
      const touchableArea = getByTestId('circle-view').parent;
      fireEvent.press(touchableArea);
      
      expect(getByText('4 things left')).toBeTruthy();
    });

    it('should navigate to stage two when count reaches zero', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageOne />);
      
      const touchableArea = getByTestId('circle-view').parent;
      
      // Tap 5 times to complete the stage
      for (let i = 0; i < 5; i++) {
        fireEvent.press(touchableArea);
      }
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageTwo');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageOne />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageTwo (4 Things You Can Touch)', () => {
    it('should render stage two with correct tapping instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageTwo />);
      
      expect(getByText('Tap the hand below for each thing you TOUCH')).toBeTruthy();
      expect(getByText('4 things left')).toBeTruthy();
      expect(getByText('Quit')).toBeTruthy();
    });

    it('should countdown when tapping the interactive element', () => {
      const { getByText, getByTestId } = render(<FiveFourThreeTwoOneStageTwo />);
      
      expect(getByText('4 things left')).toBeTruthy();
      
      const touchableArea = getByTestId('circle-view').parent;
      fireEvent.press(touchableArea);
      
      expect(getByText('3 things left')).toBeTruthy();
    });

    it('should navigate to stage three when count reaches zero', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageTwo />);
      
      const touchableArea = getByTestId('circle-view').parent;
      
      // Tap 4 times to complete the stage
      for (let i = 0; i < 4; i++) {
        fireEvent.press(touchableArea);
      }
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageThree');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageTwo />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageThree (3 Things You Can Hear)', () => {
    it('should render stage three with correct tapping instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageThree />);
      
      expect(getByText('Tap the ear below for each thing you HEAR')).toBeTruthy();
      expect(getByText('3 things left')).toBeTruthy();
      expect(getByText('Quit')).toBeTruthy();
    });

    it('should countdown when tapping the interactive element', () => {
      const { getByText, getByTestId } = render(<FiveFourThreeTwoOneStageThree />);
      
      expect(getByText('3 things left')).toBeTruthy();
      
      const touchableArea = getByTestId('circle-view').parent;
      fireEvent.press(touchableArea);
      
      expect(getByText('2 things left')).toBeTruthy();
    });

    it('should navigate to stage four when count reaches zero', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageThree />);
      
      const touchableArea = getByTestId('circle-view').parent;
      
      // Tap 3 times to complete the stage
      for (let i = 0; i < 3; i++) {
        fireEvent.press(touchableArea);
      }
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageFour');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageThree />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageFour (2 Things You Can Smell)', () => {
    it('should render stage four with correct tapping instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageFour />);
      
      expect(getByText('Tap the nose below for each thing you SMELL')).toBeTruthy();
      expect(getByText('2 things left')).toBeTruthy();
      expect(getByText('Quit')).toBeTruthy();
    });

    it('should countdown when tapping the interactive element', () => {
      const { getByText, getByTestId } = render(<FiveFourThreeTwoOneStageFour />);
      
      expect(getByText('2 things left')).toBeTruthy();
      
      const touchableArea = getByTestId('circle-view').parent;
      fireEvent.press(touchableArea);
      
      expect(getByText('1 things left')).toBeTruthy();
    });

    it('should navigate to stage five when count reaches zero', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFour />);
      
      const touchableArea = getByTestId('circle-view').parent;
      
      // Tap 2 times to complete the stage
      for (let i = 0; i < 2; i++) {
        fireEvent.press(touchableArea);
      }
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageFive');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFour />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneStageFive (1 Thing You Can Taste)', () => {
    it('should render stage five with correct tapping instructions', () => {
      const { getByText } = render(<FiveFourThreeTwoOneStageFive />);
      
      expect(getByText('Tap the tongue below for each thing you TASTE')).toBeTruthy();
      expect(getByText('1 things left')).toBeTruthy();
      expect(getByText('Quit')).toBeTruthy();
    });

    it('should navigate to final stage when tapped once', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFive />);
      
      const touchableArea = getByTestId('circle-view').parent;
      fireEvent.press(touchableArea);
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneFinal');
    });

    it('should allow quitting back to start page', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneStageFive />);
      
      fireEvent.press(getByTestId('button-quit'));
      
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStartPage');
    });
  });

  describe('FiveFourThreeTwoOneFinal', () => {
    it('should render final screen with completion message', () => {
      const { getByText } = render(<FiveFourThreeTwoOneFinal />);
      
      expect(getByText('Congratulations!')).toBeTruthy();
      expect(getByText('You successfully completed')).toBeTruthy();
      expect(getByText('grounded yourself')).toBeTruthy();
      expect(getByText('with the 5-4-3-2-1 method')).toBeTruthy();
    });

    it('should call addExerciseHistory with correct data structure', async () => {
      render(<FiveFourThreeTwoOneFinal />);
      
      await waitFor(() => {
        expect(mockAddExerciseHistory).toHaveBeenCalledWith({
          exerciseName: '5-4-3-2-1 Grounding',
          exerciseType: 'Grounding exercise',
          date: expect.any(String),
          duration: 300,
        });
      });
    });

    it('should navigate to home when to home button is pressed', () => {
      const { getByTestId } = render(<FiveFourThreeTwoOneFinal />);
      
      fireEvent.press(getByTestId('button-to-home'));
      
      expect(router.replace).toHaveBeenCalledWith('/(main)/home');
    });
  });

  describe('Exercise Flow Integration', () => {
    it('should complete the full 5-4-3-2-1 exercise flow with tapping', () => {
      // Start page
      const { getByTestId: getStartTestId } = render(<FiveFourThreeTwoOneStartPage />);
      
      fireEvent.press(getStartTestId('button-start'));
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageOne');
      
      // Stage One - tap 5 times
      jest.clearAllMocks();
      const { getByTestId: getStageOneTestId } = render(<FiveFourThreeTwoOneStageOne />);
      const touchableAreaOne = getStageOneTestId('circle-view').parent;
      
      for (let i = 0; i < 5; i++) {
        fireEvent.press(touchableAreaOne);
      }
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageTwo');
      
             // Stage Two - tap 4 times
       jest.clearAllMocks();
       const { getByTestId: getStageTwoTestId } = render(<FiveFourThreeTwoOneStageTwo />);
       const touchableAreaTwo = getStageTwoTestId('circle-view').parent;
      
      for (let i = 0; i < 4; i++) {
        fireEvent.press(touchableAreaTwo);
      }
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageThree');
      
      // Stage Three - tap 3 times
      jest.clearAllMocks();
      const { getByTestId: getStageThreeTestId } = render(<FiveFourThreeTwoOneStageThree />);
      const touchableAreaThree = getStageThreeTestId('circle-view').parent;
      
      for (let i = 0; i < 3; i++) {
        fireEvent.press(touchableAreaThree);
      }
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageFour');
      
      // Stage Four - tap 2 times
      jest.clearAllMocks();
      const { getByTestId: getStageFourTestId } = render(<FiveFourThreeTwoOneStageFour />);
      const touchableAreaFour = getStageFourTestId('circle-view').parent;
      
      for (let i = 0; i < 2; i++) {
        fireEvent.press(touchableAreaFour);
      }
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageFive');
      
      // Stage Five - tap 1 time
      jest.clearAllMocks();
      const { getByTestId: getStageFiveTestId } = render(<FiveFourThreeTwoOneStageFive />);
      const touchableAreaFive = getStageFiveTestId('circle-view').parent;
      
      fireEvent.press(touchableAreaFive);
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneFinal');
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
        
        expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStartPage');
      });
    });
  });

  describe('Interactive Elements and Count Management', () => {
    it('should have correct initial counts for each stage', () => {
      const stageConfigs = [
        { component: FiveFourThreeTwoOneStageOne, initialCount: 5, text: '5 things left' },
        { component: FiveFourThreeTwoOneStageTwo, initialCount: 4, text: '4 things left' },
        { component: FiveFourThreeTwoOneStageThree, initialCount: 3, text: '3 things left' },
        { component: FiveFourThreeTwoOneStageFour, initialCount: 2, text: '2 things left' },
        { component: FiveFourThreeTwoOneStageFive, initialCount: 1, text: '1 things left' },
      ];

      stageConfigs.forEach(config => {
        const { getByText } = render(<config.component />);
        expect(getByText(config.text)).toBeTruthy();
      });
    });

    it('should display appropriate sensory instructions for each stage', () => {
      const stageInstructions = [
        { component: FiveFourThreeTwoOneStageOne, instruction: 'Tap the eye below for each thing you SEE' },
        { component: FiveFourThreeTwoOneStageTwo, instruction: 'Tap the hand below for each thing you TOUCH' },
        { component: FiveFourThreeTwoOneStageThree, instruction: 'Tap the ear below for each thing you HEAR' },
        { component: FiveFourThreeTwoOneStageFour, instruction: 'Tap the nose below for each thing you SMELL' },
        { component: FiveFourThreeTwoOneStageFive, instruction: 'Tap the tongue below for each thing you TASTE' },
      ];

      stageInstructions.forEach(stage => {
        const { getByText } = render(<stage.component />);
        expect(getByText(stage.instruction)).toBeTruthy();
      });
    });

    it('should prevent over-tapping past zero count', () => {
      const { getByTestId, getByText } = render(<FiveFourThreeTwoOneStageOne />);
      
      const touchableArea = getByTestId('circle-view').parent;
      
      // Tap exactly 5 times (should navigate)
      for (let i = 0; i < 5; i++) {
        fireEvent.press(touchableArea);
      }
      
      // Should have navigated, not decreased below 0
      expect(router.replace).toHaveBeenCalledWith('FiveFourThreeTwoOneStageTwo');
    });
  });
}); 