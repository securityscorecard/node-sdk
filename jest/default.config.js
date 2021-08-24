module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.spec.*'],
  coveragePathIgnorePatterns: ['__test__'],
  bail: 1,
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: require.resolve('./babel.config.js') }],
  },
};
