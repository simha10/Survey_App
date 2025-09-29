module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    // IMPORTANT: react-native-reanimated plugin must be last
    plugins: [...plugins, 'react-native-reanimated/plugin'],
  };
};
