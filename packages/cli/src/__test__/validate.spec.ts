/* eslint-disable no-underscore-dangle */
import command from '../commands/validate';
import * as logger from '../utils/logger';
import mockedRc from './helpers/rc';
import apps from '../services/apps';

jest.mock('../utils/inquires');

jest.mock('../utils/rc');
const rc = require('../utils/rc');

beforeEach(() => {
  jest.spyOn(logger, 'log');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Validate', () => {
  test('no url found on manifest.json', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc();

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest(null);

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.error('No manifest found or URL config'));
    expect(logger.log).toHaveBeenCalledWith(logger.error('ie.: ssc validate -u <YOUR_URL>'));
  });
  test('no token found on CLI RC', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc({});

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest(mockedRc.productionConfiguration);

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(
      logger.error('No token found for production, you must set your config first'),
    );
    expect(logger.log).toHaveBeenCalledWith(logger.error('ie.: ssc config'));
  });

  test('validation success', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest('https://testurl.com');

    jest.spyOn(apps, 'validate').mockReturnValue(Promise.resolve({ success: true, message: 'Validation Success' }));

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(rc.readRc).toHaveBeenCalledTimes(1);
    expect(apps.validate).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(logger.info('\nValidation Success'));
  });
  test('validation fails', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest('https://testurl.com');

    jest.spyOn(apps, 'validate').mockReturnValue(Promise.resolve({ success: false, message: 'Validation Failed' }));

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(rc.readRc).toHaveBeenCalledTimes(1);
    expect(apps.validate).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(logger.error('\nValidation Error', '\nValidation Failed'));
  });
});
