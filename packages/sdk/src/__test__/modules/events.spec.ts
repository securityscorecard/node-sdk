import SecurityScorecardAPI from '../../api';
import * as nockHelper from '../helpers/nock';
import Events from '../../modules/events';

beforeEach(() => {
  nockHelper.stop();
});

afterEach(() => {
  nockHelper.stop();
});

describe('Events', () => {
  test('dispatch fake event without ruleId', async () => {
    // helpers
    const token = 'test_540cb78a-2801-11ec-9621-0242ac130002';
    const requestBody = {
      type: 'scorecard.changed',
      event: { test: 'test_event' },
    };

    const api = new SecurityScorecardAPI(token, {
      host: nockHelper.MOCK_SERVER_URL,
    });
    const eventsModule = Events(api);
    const event = eventsModule.trigger(requestBody);
    await expect(event).rejects.toThrow('A ruleId is required!');
  });
  test('dispatch fake event successfully', async () => {
    // helpers
    const token = 'test_df5865ab-e168-4231-8438-ed9bee5da14e';
    const ruleId = 'test_69f7817e-2801-11ec-9621-0242ac130002';
    const statusReceived = { received: true };
    const requestBody = {
      type: 'scorecard.changed',
      event: { test: 'test_event', trial: { rule_id: ruleId } },
    };

    const api = new SecurityScorecardAPI(token, {
      host: nockHelper.MOCK_SERVER_URL,
    });

    const scope = nockHelper.listenMockServer({
      options: { reqheaders: { Authorization: `Token ${token}` } },
    });
    // only the event is being sent
    scope.post('/events/scorecard.changed', requestBody.event).reply(200, statusReceived);
    const eventsModule = Events(api);
    const event = await eventsModule.trigger({
      ruleId,
      ...requestBody,
    });
    expect(event).toMatchObject(statusReceived);
    expect(scope.isDone()).toEqual(true);
  });
  test('dispatch fake event fails', async () => {
    // helpers
    const token = 'test_1ea075e2-a783-4650-b324-0f6a13578b4e';
    const ruleId = 'test_03806000-2806-11ec-9621-0242ac130002';
    const requestBody = {
      type: 'scorecard.changed',
      event: { test: 'test_event', trial: { rule_id: ruleId } },
    };

    const api = new SecurityScorecardAPI(token, {
      host: nockHelper.MOCK_SERVER_URL,
    });

    const scope = nockHelper.listenMockServer({
      options: { reqheaders: { Authorization: `Token ${token}` } },
    });
    // only the event is being sent
    scope.post('/events/scorecard.changed', requestBody.event).reply(500, undefined);
    const eventsModule = Events(api);

    const event = eventsModule.trigger({
      ruleId,
      ...requestBody,
    });
    await expect(event).rejects.toThrow('there was an error when trying to call [POST] - /events/scorecard.changed');
    expect(scope.isDone()).toEqual(true);
  });
});
