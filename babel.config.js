module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@screens': './src/screens',
            '@components': './src/components',
            '@viewmodels': './src/viewmodels',
            '@services': './src/services',
            '@repositories': './src/repositories',
            '@models': './src/models',
            '@theme': './src/theme',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
