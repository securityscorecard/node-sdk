import { log, info } from '../utils/logger';
import { ConfigArguments } from '../utils/types';
import { SSC_RC_PATH, PLATFORM_URL } from '../utils/helpers';
import { readRc, writeRc } from '../utils/rc';
import * as inquires from '../utils/inquires';

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

const configure = async (args: ConfigArguments) => {
  const env: string = (await inquires.askEnviroment()).enviroment;
  log(info('\nYou can generate an API token in the following url', `\n${PLATFORM_URL[env]}/my-settings/api`));
  const token: string = args?.token || (await inquires.askToken()).token;
  const existsToken = !!readRc(SSC_RC_PATH)[env]?.token;
  const replaceToken: boolean = existsToken && (await inquires.askTokenReplacement()).replace;

  // escape the workflow since we dont want to replace the token
  if (existsToken && !replaceToken) return;

  setToken(SSC_RC_PATH, { env, token });

  log(info('Token successfully set!'));
};

export default configure;
