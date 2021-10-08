/* eslint-disable no-underscore-dangle */
import command from '../commands/install';
import * as logger from '../utils/logger';
import mockedRc from './helpers/rc';
import apps from '../services/apps';

jest.mock('../utils/inquires');
const inquires = require('../utils/inquires');

jest.mock('../utils/rc');
const rc = require('../utils/rc');

beforeEach(() => {
  jest.spyOn(logger, 'log');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Install', () => {
  test('no url found on manifest.json', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc();

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest(null);

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.error('No manifest found or URL config'));
    expect(logger.log).toHaveBeenCalledWith(logger.error('ie.: ssc install -u <YOUR_URL>'));
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
  test('no arguments and rc/manifest is set', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest('https://testurl.com');

    const mockedInstall = Promise.resolve({ id: 'some_id', url: 'https://testurl.com', name: 'testing app' });
    jest.spyOn(apps, 'install').mockReturnValue(mockedInstall);

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(rc.readRc).toHaveBeenCalledTimes(1);
    expect(apps.install).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      logger.info(
        '\n🚀 Congratulations, now you can find your application at',
        '\nhttps://platform.securityscorecard.io/#i/marketplace/some_id',
      ),
    );
  });
  test('enviroment is testing and rc/manifest is set', async () => {
    jest.spyOn(inquires, 'askEnvironment');
    inquires.__setEnvironment({ environment: 'testing' });

    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.testingConfiguration);

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest('https://testurl.com');

    const mockedInstall = Promise.resolve({ id: 'some_id', url: 'https://testurl.com', name: 'testing app' });
    jest.spyOn(apps, 'install').mockReturnValue(mockedInstall);

    await command({ environment: false });

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(rc.readRc).toHaveBeenCalledTimes(1);
    expect(apps.install).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      logger.info(
        '\n🚀 Congratulations, now you can find your application at',
        '\nhttps://platform.securityscorecard.qa/#/marketplace/some_id',
      ),
    );
  });
  test('installation fails', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(rc, 'urlFromManifest');
    rc.__setUrlFromManifest('https://testurl.com');

    jest.spyOn(apps, 'install').mockReturnValue(Promise.reject());

    await command({ environment: true });

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(rc.readRc).toHaveBeenCalledTimes(1);
    expect(apps.install).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(logger.error('Something went wrong. '));
  });
});
