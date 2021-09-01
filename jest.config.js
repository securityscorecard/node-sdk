module.exports = {
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  projects: [require('@securityscorecard/cli/jest.config'), require('@securityscorecard/sdk/jest.config')],
  testPathIgnorePatterns: ['.*'],
};
