import inquirer from 'inquirer';
import { log, info } from '../utils/logger';
import { IConfigArguments } from './types';
import { SSC_RC_PATH, ENVIROMENTS, PLATFORM_URL } from '../utils/helpers';
import { readRc, writeRc } from '../utils/rc';

const askToken = (env: string): Promise<{ token: string }> => {
  log(info('\nYou can generate an API token in the following url', `\n${PLATFORM_URL[env]}/my-settings/api`));
  return inquirer.prompt([
    {
      name: 'token',
      type: 'input',
      message: 'You need to provide an API token',
    },
  ]);
};

const askTokenReplacement = (): Promise<{ replace: boolean }> =>
  inquirer.prompt([
    {
      name: 'replace',
      type: 'confirm',
      message: 'You already have a token configured, do you want to replace it?',
      default: false,
    },
  ]);

const askEnviroment = (): Promise<{
  enviroment: 'production' | 'testing' | 'development';
}> =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'enviroment',
      message: 'What environment do you want to configure?',
      choices: ENVIROMENTS,
    },
  ]);

const setToken = async (
  rcPath: string,
  {
    env,
    token,
  }: {
    env: string;
    token: string;
  },
): Promise<void> => writeRc(rcPath, { ...readRc(rcPath), ...{ [env]: { token } } });

const configure = async (args: IConfigArguments) => {
  const env: string = (await askEnviroment()).enviroment;
  const token: string = args?.token || (await askToken(env)).token;
  const existsToken = !!readRc(SSC_RC_PATH)[env]?.token;
  const replaceToken: boolean = existsToken && (await askTokenReplacement()).replace;

  // escape the workflow since we dont want to replace the token
  if (existsToken && !replaceToken) return;

  setToken(SSC_RC_PATH, { env, token });

  log(info('Token successfully set!'));
};

export default configure;
