const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  preset: '../../jest/default.config',
  testPathIgnorePatterns: ['__test__/helpers'],
  displayName: {
    name: packageJson.name,
    color: 'blue',
  },
  rootDir: path.resolve(__dirname),
  roots: ['src'],
};
