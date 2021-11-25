/* eslint-disable no-underscore-dangle */
import path from 'path';
import command from '../commands/simulate';
import * as logger from '../utils/logger';
import apps from '../services/apps';
import mockedRc from './helpers/rc';
import { subscriptionResponse } from './helpers/subscriptions';

jest.mock('../utils/rc');
const rc = require('../utils/rc');

jest.mock('../utils/inquires');
const inquires = require('../utils/inquires');

beforeEach(() => {
  jest.spyOn(logger, 'log');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('simulate', () => {
  test('No token', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc({});

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest(mockedRc.productionConfiguration);

    await command({ environment: true, file: '' });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(
      logger.error('No token found for production, you must set your config first'),
    );
    expect(logger.log).toHaveBeenCalledWith(logger.error('ie.: ssc config'));
  });

  test('No rules found', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);
    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(undefined));
    await command({ environment: true, file: '' });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.error('\nNo rules found!'));
  });

  test('Invalid json file', async () => {
    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(undefined));

    const filePath = path.join(__dirname, './helpers/invalid_json.json');
    await command({ environment: true, file: filePath });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.error('Invalid file arg'));
    // TODO: check a better way to match an invalid json error
    expect(logger.log).toHaveBeenCalledWith(logger.error('Unexpected token , in JSON at position 21'));
  });

  test('File not found', async () => {
    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(undefined));

    const filePath = path.join(__dirname, './helpers/not_found.json');
    await command({ environment: true, file: filePath });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.error('Invalid file arg'));
    // TODO: check a better way to match an ENOENT error
    const expectedError = `ENOENT: no such file or directory, open '${filePath}'`;
    expect(logger.log).toHaveBeenCalledWith(logger.error(expectedError));
  });

  test('Invalid event payload', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(subscriptionResponse));
    inquires.__setAskEventToSimulate({ rule: 'send email' });
    inquires.__setAskForFakeEvent('{badJSON:');
    await command({ environment: true, file: '' });
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(logger.error('Invalid fake event'));
  });

  test('Something went wrong when simulating the event', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(subscriptionResponse));
    inquires.__setAskEventToSimulate({ rule: 'send email' });
    const filePath = path.join(__dirname, './helpers/valid_fake_event.json');
    jest.spyOn(apps, 'events').mockReturnValue(Promise.reject());
    await command({ environment: true, file: filePath });
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.error('Something went wrong. '));
  });

  test('Event emitted using file', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(subscriptionResponse));
    inquires.__setAskEventToSimulate({ rule: 'send email' });
    const filePath = path.join(__dirname, './helpers/valid_fake_event.json');
    jest.spyOn(apps, 'events').mockReturnValue(Promise.resolve({ received: true }));
    await command({ environment: true, file: filePath });
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.info('🦾 Rule event triggered, check your app logs!'));
  });

  test('Event emitted using user input', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(apps, 'subscriptions').mockReturnValue(Promise.resolve(subscriptionResponse));
    inquires.__setAskEventToSimulate({ rule: 'send email' });
    inquires.__setAskForFakeEvent(
      JSON.stringify({
        platform_score_date: 42030679,
        current: {
          score: 90,
          factors: {
            network_security: 80,
            dns_health: 95,
            endpoint_security: 88,
            patching_cadence: 85,
          },
        },
        domain: 'example.com',
        previous: {
          score: 10,
          factors: {
            network_security: 80,
            dns_health: 95,
            endpoint_security: 88,
            patching_cadence: 85,
          },
        },
        issues: {
          csp_no_policy: {
            active: {
              count: 15,
            },
            departed: {
              count: 3,
            },
            resolved: {
              count: 2,
            },
          },
          domain_missing_https: {
            active: {
              count: 5,
            },
          },
        },
        breach: {
          root_cause: 'hacked',
          records_lost: 10000,
          date_discovered: 0,
          type_of_breach: '',
        },
      }),
    );
    jest.spyOn(apps, 'events').mockReturnValue(Promise.resolve({ received: true }));
    await command({ environment: true, file: '' });
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.info('🦾 Rule event triggered, check your app logs!'));
  });
});
