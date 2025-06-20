// Jest setup file for React Native testing
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(() => ({
    id: 'mock-doc-id',
    path: 'mock-path',
  })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  setDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => false,
    data: () => ({}),
    id: 'mock-doc-id',
  })),
  getDocs: jest.fn(() => Promise.resolve({
    docs: [],
    empty: true,
    size: 0,
  })),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
  Link: 'Link',
  Stack: {
    Screen: 'Screen',
  },
  Tabs: {
    Screen: 'Screen',
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({
        sound: {
          playAsync: jest.fn(),
          pauseAsync: jest.fn(),
          stopAsync: jest.fn(),
          unloadAsync: jest.fn(),
          setOnPlaybackStatusUpdate: jest.fn(),
        },
      })),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock React Native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (Component: any) => Component,
}));

// Mock Victory Native charts
jest.mock('victory-native', () => ({
  VictoryChart: 'VictoryChart',
  VictoryLine: 'VictoryLine',
  VictoryArea: 'VictoryArea',
  VictoryBar: 'VictoryBar',
  VictoryPie: 'VictoryPie',
  VictoryAxis: 'VictoryAxis',
  VictoryTheme: {
    material: {},
  },
}));

// Mock React Native Progress
jest.mock('react-native-progress', () => ({
  Circle: 'Circle',
  Bar: 'Bar',
  Pie: 'Pie',
}));

// Mock React Native Circular Progress
jest.mock('react-native-circular-progress', () => ({
  CircularProgress: 'CircularProgress',
  AnimatedCircularProgress: 'AnimatedCircularProgress',
}));

// Mock React Native Animatable
jest.mock('react-native-animatable', () => ({
  createAnimatableComponent: (component: any) => component,
  View: 'Animatable.View',
  Text: 'Animatable.Text',
}));

// Global test utilities
global.fetch = jest.fn();

// Silence console warnings in tests
global.console = {
  ...console,
  // Uncomment to ignore specific warning types
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  // Only clean up timers if they were actually set up
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  }
}); 