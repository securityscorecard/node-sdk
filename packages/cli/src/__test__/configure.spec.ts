/* eslint-disable no-underscore-dangle */
import command from '../commands/configure';
import * as logger from '../utils/logger';
import mockedRc from './helpers/rc';

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

describe('Configure', () => {
  test('default environment and token is provided', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc({});

    jest.spyOn(rc, 'writeRc').mockReturnValue(Promise.resolve());

    await command({ environment: true, token: 'production_token' });

    expect(rc.readRc).toHaveBeenCalledTimes(2);
    expect(rc.writeRc).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.info('Token successfully set!'));
  });
  test('default enviroment and no token is provided', async () => {
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc({});

    jest.spyOn(inquires, 'askToken');
    inquires.__setToken(mockedRc.productionConfiguration);

    jest.spyOn(rc, 'writeRc').mockReturnValue(Promise.resolve());

    await command({ environment: true });

    expect(rc.readRc).toHaveBeenCalledTimes(2);
    expect(rc.writeRc).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.info('Token successfully set!'));
  });
  test('token replacement approved', async () => {
    // token already exists on RC file
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(inquires, 'askToken');
    inquires.__setToken(mockedRc.productionConfiguration);

    jest.spyOn(inquires, 'askTokenReplacement');
    inquires.__setTokenReplacement({ replace: true });

    jest.spyOn(rc, 'writeRc').mockReturnValue(Promise.resolve());

    await command({ environment: true });

    expect(rc.readRc).toHaveBeenCalledTimes(2);
    expect(rc.writeRc).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.info('Token successfully set!'));
  });
  test('token replacement denied', async () => {
    // token already exists on RC file
    jest.spyOn(rc, 'readRc');
    rc.__setMockRc(mockedRc.productionConfiguration);

    jest.spyOn(inquires, 'askToken');
    inquires.__setToken(mockedRc.productionConfiguration);

    jest.spyOn(inquires, 'askTokenReplacement');
    inquires.__setTokenReplacement({ replace: false });

    jest.spyOn(rc, 'writeRc').mockReturnValue(Promise.resolve());

    await command({ environment: true });

    expect(rc.readRc).toHaveBeenCalledTimes(1);
    expect(rc.writeRc).toHaveBeenCalledTimes(0);
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(logger.info('Token replacement cancelled!'));
  });
});
