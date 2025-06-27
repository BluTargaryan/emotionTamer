module.exports = function (api) {
    api.cache(true);
    
    // Check if we're in test environment
    const isTest = process.env.NODE_ENV === 'test';
    
    return {
      presets: [
        [
          "babel-preset-expo", 
          { 
            jsxImportSource: isTest ? "react" : "react-native-css-interop" 
          }
        ],
        // Only use nativewind/babel in non-test environments
        ...(isTest ? [] : ["nativewind/babel"]),
      ],
      plugins: [
        "react-native-reanimated/plugin",
      ],
    };
  };