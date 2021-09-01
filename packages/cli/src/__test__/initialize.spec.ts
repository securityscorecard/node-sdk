/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import pacote from 'pacote';
import * as command from '../commands/initialize';
import * as logger from '../utils/logger';
import errors from '../utils/errors';
import mockedPacote from './helpers/pacote';

jest.mock('../utils/inquires');

const inquires = require('../utils/inquires');

beforeEach(() => {
  jest.spyOn(logger, 'log');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Initializing', () => {
  test('fail, example does not exists', async () => {
    // manifest will reject request since it does not exists
    jest.spyOn(pacote, 'manifest').mockImplementation(() => Promise.reject());
    try {
      await command.initialize({ example: 'some-random-name' });
    } catch (error) {
      expect(error.message).toMatch('Could not extract example');
      expect(error).toBeInstanceOf(errors.CLIError);
    }
    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(pacote.manifest).toHaveBeenCalledTimes(1);
  });

  test('fail, can not fetch example list', async () => {
    inquires.__setMockExample('experimental-bare-app');
    // when trying to fetch cli-manifest fails somehow
    jest.spyOn(pacote, 'manifest').mockImplementation(() => Promise.reject());
    try {
      await command.initialize({});
    } catch (error) {
      expect(error.message).toMatch('Could not fetch example list');
      expect(error).toBeInstanceOf(errors.CLIError);
    }
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(pacote.manifest).toHaveBeenCalledTimes(1);
  });

  test('succeed, whithout example and not overriding existing folder', async () => {
    jest.spyOn(inquires, 'askExampleSelection');
    jest.spyOn(pacote, 'manifest').mockImplementation(() => Promise.resolve(mockedPacote.manifest));
    inquires.__setMockExample('experimental-bare-app');
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    await command.initialize({});

    expect(logger.log).toHaveBeenCalledTimes(3);
    expect(pacote.manifest).toHaveBeenCalledTimes(1);
    expect(inquires.askExampleSelection).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(logger.info('\nInitializing example:'), 'experimental-bare-app');
    expect(logger.log).toHaveBeenCalledWith(logger.info('Remember you could always:'), 'ssc init -f <folder_name>');
  });

  test('succeed, whithout example and overrides existing folder', async () => {
    jest.spyOn(inquires, 'askExampleSelection');
    inquires.__setMockExample('experimental-bare-app');
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    inquires.__setOverridingResponse(true);
    jest.spyOn(pacote, 'manifest').mockImplementation(() => Promise.resolve(mockedPacote.manifest));
    jest.spyOn(pacote, 'extract').mockImplementation(() => Promise.resolve(mockedPacote.extraction));

    await command.initialize({});

    expect(logger.log).toHaveBeenCalledTimes(4);
    expect(pacote.manifest).toHaveBeenCalledTimes(2);
    expect(pacote.extract).toHaveBeenCalledTimes(1);
    expect(inquires.askExampleSelection).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(logger.info('\nInitializing example:'), 'experimental-bare-app');
  });
});
