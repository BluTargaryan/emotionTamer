// Mock for react-native-css-interop to handle NativeWind in tests

const React = require('react');
const RN = require('react-native');

// Mock the main CSS interop functions
const getUseOfValueInStyleWarning = () => () => {};

// Mock JSX runtime functions
const jsx = React.createElement;
const jsxs = React.createElement;
const Fragment = React.Fragment;

// Mock style processing
const StyleSheet = {
  ...RN.StyleSheet,
  create: (styles) => styles,
};

// Mock color scheme
const useColorScheme = () => 'light';

// Mock CSS variables
const vars = {};

// Mock rem function
const rem = (value) => value * 16;

// Export all the functions that CSS interop provides
module.exports = {
  ...RN,
  jsx,
  jsxs,
  Fragment,
  getUseOfValueInStyleWarning,
  useColorScheme,
  vars,
  rem,
  StyleSheet,
  // Additional CSS interop exports
  cssInterop: () => ({}),
  remapProps: () => ({}),
  useUnstableNativeVariable: () => undefined,
};

// Also export as default for default imports
module.exports.default = module.exports; 