import mockEnv from '../__mocks__/env';

describe('configs', () => {
  test('load from env', () => {
    const restoreEnv = mockEnv({
      SSC_API_TOKEN: 'some_token',
      SSC_API_HOST: 'http://platform-api.securityscorecard.io',
    });
    let configs;
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      const configsModule = require('../configs');
      configs = configsModule.default;
    });
    expect(configs).toEqual({ token: 'some_token', host: 'http://platform-api.securityscorecard.io' });
    restoreEnv();
  });
});
