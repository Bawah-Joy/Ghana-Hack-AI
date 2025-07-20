const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this resolver for expo-router
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'expo-router': require.resolve('expo-router'),
};

module.exports = config;