module.exports = api => {
  api.cache(true);
  return {
    // Only use this when running tests
    env: {
      test: {
        presets: [
          [
            // eslint-disable-next-line global-require,import/no-extraneous-dependencies
            require('@babel/preset-env'),
            {
              targets: {
                node: 'current',
              },
            },
          ],
          // eslint-disable-next-line global-require,import/no-extraneous-dependencies
          [require('@babel/preset-typescript')],
        ],
      },
    },
  };
};
