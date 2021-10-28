import * as R from 'rambda';
// eslint-disable-next-line import/no-extraneous-dependencies
import SecurityScorecardAPI from '../../api';
import Apps from '../../modules/apps';
import * as nockHelper from '../helpers/nock';

const mockInstallAppSuccessResponse = (attrs: any) => ({
  id: 'e7b4efb6-4fe5-4f69-8873-d88abb944ac9',
  url: 'https://sample-app.app/public/manifest.json',
  created_by: 'someone@securityscorecard.io',
  created_at: new Date().toISOString(),
  name: 'Experimental Toretto App',
  namespace: '',
  logo_url: 'https://sample-app.app/apps/e7b4efb6-4fe5-4f69-8873-d88abb944ac9/logo.png',
  description: 'Fast & Safe',
  long_description: 'Toretto is a tiny and fast app only for experimental purposes only',
  tags: [],
  homepage: 'https://sample-app.app',
  developer: 'someone.com',
  installed_at: new Date().toISOString(),
  configuration_complete: true,
  ...attrs,
});

const mockValidateManifestSuccessResponse = () => ({
  success: true,
  message: 'Validation Success',
});

const mockValidateManifestFailedResponse = () => ({
  success: false,
  message: 'Error: invalid namespace: "312312 invalid manifest"',
});

afterAll(() => {
  nockHelper.stop();
});

afterEach(() => {
  nockHelper.stop();
});

describe('modules -> apps', () => {
  describe('install', () => {
    test('successfully install new app', async () => {
      const token = 'test_4gxJxaiA1uBqOIAoIarFGV';
      const appInfo = {
        url: 'https://toretto-cristiandley.vercel.app/manifest.json',
        id: '00000-4fe5-4f69-8873-d88abb944ac9',
        name: 'Sample App',
      };
      const api = new SecurityScorecardAPI(token, {
        host: nockHelper.MOCK_SERVER_URL,
      });
      const scope = nockHelper.listenMockServer({
        options: { reqheaders: { Authorization: `Token ${token}` } },
      });
      scope
        .post('/apps', {
          url: 'https://toretto-cristiandley.vercel.app/manifest.json',
        })
        .reply(200, mockInstallAppSuccessResponse(appInfo));
      const appsModule = Apps(api);
      const app = await appsModule.install({
        url: 'https://toretto-cristiandley.vercel.app/manifest.json',
      });
      expect(app).toMatchObject(appInfo);
      expect(scope.isDone()).toEqual(true);
    });
  });

  describe('validate', () => {
    test('successfully validate app manifest', async () => {
      const token = 'test_4gxJxaiA1uBqOIAoIarFGV';
      const validationInfo = {
        success: true,
        message: 'Validation Success',
      };
      const api = new SecurityScorecardAPI(token, {
        host: nockHelper.MOCK_SERVER_URL,
      });
      const scope = nockHelper.listenMockServer({
        options: { reqheaders: { Authorization: `Token ${token}` } },
      });
      scope
        .post('/apps/validate-manifest', {
          url: 'https://toretto-cristiandley.vercel.app/manifest.json',
        })
        .reply(200, mockValidateManifestSuccessResponse());
      const appsModule = Apps(api);
      const app = await appsModule.validate({
        url: 'https://toretto-cristiandley.vercel.app/manifest.json',
      });
      expect(app).toMatchObject(validationInfo);
      expect(scope.isDone()).toEqual(true);
    });
    test('failed validate app manifest', async () => {
      const token = 'test_4gxJxaiA1uBqOIAoIarFGV';
      const validationInfo = {
        success: false,
        message: 'Error: invalid namespace: "312312 invalid manifest"',
      };
      const api = new SecurityScorecardAPI(token, {
        host: nockHelper.MOCK_SERVER_URL,
      });
      const scope = nockHelper.listenMockServer({
        options: { reqheaders: { Authorization: `Token ${token}` } },
      });
      scope
        .post('/apps/validate-manifest', {
          url: 'https://toretto-cristiandley.vercel.app/manifest.json',
        })
        .reply(200, mockValidateManifestFailedResponse());
      const appsModule = Apps(api);
      const app = await appsModule.validate({
        url: 'https://toretto-cristiandley.vercel.app/manifest.json',
      });
      expect(app).toMatchObject(validationInfo);
      expect(scope.isDone()).toEqual(true);
    });
  });

  describe('sendSignals', () => {
    test('send signal', async () => {
      const token = 'test_LfWMPT5ElimrEH9OuOdPAFh';
      const signalType = 'experimental_signal_app.leaked_information';
      const mockResponse = [
        { id: '5666d460-e1b0-5415-ad95-ee26ac8c82af' },
        { id: '4923463a-326e-5525-979c-5b6a29464926' },
      ];
      const signals = [
        {
          domain: 'securityscorecard.com',
          summary: 'See this signal',
          lastSeen: new Date().toISOString(),
        },
        {
          domain: 'example.com',
          summary: 'See this signal',
          lastSeen: new Date().toISOString(),
        },
      ];

      const api = new SecurityScorecardAPI(token, {
        host: nockHelper.MOCK_SERVER_URL,
      });

      const scope = nockHelper.listenMockServer({
        options: { reqheaders: { Authorization: `Token ${token}` } },
      });

      // we need to check with a functions because the payload is an array
      const compareBody = (body: any) =>
        R.equals(body, [
          {
            op: 'add',
            value: {
              domain: 'securityscorecard.com',
              summary: 'See this signal',
              last_seen: signals[0].lastSeen,
            },
          },
          {
            op: 'add',
            value: {
              domain: 'example.com',
              summary: 'See this signal',
              last_seen: signals[1].lastSeen,
            },
          },
        ]);
      scope.patch(`/signals/by-type/${signalType}`, compareBody).reply(200, mockResponse);
      const appsModule = Apps(api);

      const signalsResult = await appsModule.sendSignals('experimental_signal_app.leaked_information', signals);

      expect(signalsResult).toEqual([
        { id: '5666d460-e1b0-5415-ad95-ee26ac8c82af' },
        { id: '4923463a-326e-5525-979c-5b6a29464926' },
      ]);
      expect(scope.isDone()).toEqual(true);
    });
  });

  describe('updateInstallationData', () => {
    test('successfully complete install', async () => {
      const token = 'test_LfWMPT5ElimrEH9OuOdPAFh';
      const installationData = {
        installation: 'some_installation_token',
        secrets: [
          { key: 'app_secret', value: 'shhh' },
          { key: 'external_token', value: 'token_value' },
        ],
      };

      const api = new SecurityScorecardAPI(token, {
        host: nockHelper.MOCK_SERVER_URL,
      });

      const apps = Apps(api);

      const scope = nockHelper
        .listenMockServer()
        .post('/apps/installation-data', installationData)
        .reply(200, { next_url: 'some_url' });

      const installationResponse = await apps.updateInstallationData(installationData);
      expect(installationResponse).toEqual({ next_url: 'some_url' });
      expect(scope.isDone()).toEqual(true);
    });
  });
});
