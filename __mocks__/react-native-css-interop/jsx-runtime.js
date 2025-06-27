// Mock for react-native-css-interop/jsx-runtime

const React = require('react');

module.exports = {
  jsx: React.createElement,
  jsxs: React.createElement,
  Fragment: React.Fragment,
};

module.exports.default = module.exports; 