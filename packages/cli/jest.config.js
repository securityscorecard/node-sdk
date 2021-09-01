const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  preset: '../../jest/default.config',
  displayName: {
    name: packageJson.name,
    color: 'magenta',
  },
  rootDir: path.resolve(__dirname),
  roots: ['src'],
};
