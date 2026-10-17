const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

if (process.platform === 'win32') {
  config.watcher = {
    ...config.watcher,
    watchman: {
      enabled: false,
    },
  };
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);