import SecurityScorecardAPI from '../../api';
import * as nockHelper from '../helpers/nock';
import Subscriptions from '../../modules/subscriptions';

beforeEach(() => {
  nockHelper.stop();
});

afterEach(() => {
  nockHelper.stop();
});

describe('Subscriptions', () => {
  test('list owned subscriptions successfully', async () => {
    // helpers
    const token = 'test_540cb78a-2801-11ec-9621-0242ac130002';
    const userData = { username: 'toretto@securityscorecard.com' };

    const api = new SecurityScorecardAPI(token, {
      host: nockHelper.MOCK_SERVER_URL,
    });

    const scope = nockHelper.listenMockServer({
      options: { reqheaders: { Authorization: `Token ${token}` } },
    });

    scope.get('/myself').reply(200, userData);

    scope
      .get('/subscriptions')
      .query({ username: userData.username, page: 1, 'page-size': 50 })
      .reply(200, { entries: [], size: 0 });

    const subscriptionsModule = Subscriptions(api);
    const subscriptions = await subscriptionsModule.owned();
    expect(subscriptions).toMatchObject({ entries: [], size: 0 });
    expect(scope.isDone()).toEqual(true);
  });
});
