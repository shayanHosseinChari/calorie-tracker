module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@": "./src",
          "@shared": "./src/shared",
          "@features": "./src/features",
        },
      },
    ],
    // "react-native-reanimated/plugin",
  ],
};
