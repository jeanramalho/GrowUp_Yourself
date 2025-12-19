module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@domain': './src/domain',
            '@data': './src/data',
            '@services': './src/services',
            '@styles': './src/styles',
            '@utils': './src/utils',
            '@i18n': './src/i18n',
            '@config': './src/config',
          },
        },
      ],
    ],
  };
};
