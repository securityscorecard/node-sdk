/* eslint-disable import/no-extraneous-dependencies */
import nock from 'nock';
/* eslint-enable import/no-extraneous-dependencies */
import SecurityScorecardAPI from '../api';

describe('SecurityScorecardAPI', () => {
  describe('constants', () => {
    test('DEFAULT_TIMEOUT_MS', () => {
      expect(SecurityScorecardAPI.DEFAULT_TIMEOUT_MS).toEqual(60_000);
    });

    test('DEFAULT_MAX_RETRIES', () => {
      expect(SecurityScorecardAPI.DEFAULT_MAX_RETRIES).toEqual(0);
    });

    test('DEFAULT_HOST', () => {
      expect(SecurityScorecardAPI.DEFAULT_HOST).toEqual('https://platform-api.securityscorecard.io');
    });
  });

  describe('intialize', () => {
    it('should set default config', () => {
      const securityScorecardAPI = new SecurityScorecardAPI('random_token');
      const defaultConfig = {
        host: 'https://platform-api.securityscorecard.io',
        maxRetries: 0,
        timeout: 60_000,
      };

      expect(securityScorecardAPI.config).toEqual({
        token: 'random_token',
        ...defaultConfig,
      });
    });

    test('override baseUrl', () => {
      const securityScorecardAPI = new SecurityScorecardAPI('random_token', {
        host: 'https://local.securityscorecard.io',
      });
      const defaultConfig = {
        host: 'https://platform-api.securityscorecard.io',
        maxRetries: 0,
        timeout: 60_000,
      };

      expect(securityScorecardAPI.config).toEqual({
        ...defaultConfig,
        token: 'random_token',
        host: 'https://local.securityscorecard.io',
      });
    });

    test('override timeout', () => {
      const securityScorecardAPI = new SecurityScorecardAPI('random_token', {
        timeout: 10_000,
      });
      const defaultConfig = {
        host: 'https://platform-api.securityscorecard.io',
        maxRetries: 0,
        timeout: 60_000,
      };

      expect(securityScorecardAPI.config).toEqual({
        ...defaultConfig,
        token: 'random_token',
        timeout: 10_000,
      });
    });

    test('override maxRetries', () => {
      const securityScorecardAPI = new SecurityScorecardAPI('random_token', {
        maxRetries: 10,
      });
      const defaultConfig = {
        host: 'https://platform-api.securityscorecard.io',
        maxRetries: 0,
        timeout: 60_000,
      };

      expect(securityScorecardAPI.config).toEqual({
        ...defaultConfig,
        token: 'random_token',
        maxRetries: 10,
      });
    });
  });

  describe('apiCall', () => {
    test('call any endpoint with authorization', async () => {
      const mockServerUrl = 'https://mock-api.securityscorecard.io';
      const testToken = 'TEST_TOKEN';
      const sscApi = new SecurityScorecardAPI(testToken, {
        host: mockServerUrl,
      });

      if (!nock.isActive()) nock.activate();
      nock.disableNetConnect();

      const scope = nock(mockServerUrl, {
        reqheaders: {
          Authorization: `Token ${testToken}`,
        },
      })
        .get('/portfolios')
        .reply(200, { ok: 'ok' });
      const resp = await sscApi.apiCall('/portfolios');
      expect(resp).toEqual({ ok: 'ok' });
      scope.done();
    });

    test('call any endpoint without authorization', async () => {
      const mockServerUrl = 'https://mock-api.securityscorecard.io';
      const testToken = 'TEST_TOKEN';
      const sscApi = new SecurityScorecardAPI(testToken, {
        host: mockServerUrl,
      });

      if (!nock.isActive()) nock.activate();
      nock.disableNetConnect();

      const scope = nock(mockServerUrl, {
        badheaders: ['Authorization'],
      })
        .get('/portfolios')
        .reply(200, { ok: 'ok' });
      const resp = await sscApi.apiCall('/portfolios', {
        authorize: false,
      });
      expect(resp).toEqual({ ok: 'ok' });
      scope.done();
    });
  });
});
