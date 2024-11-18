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
            '@': './', // Define el alias para que coincida con tsconfig.json
          },
        },
      ],
    ],
  };
};
