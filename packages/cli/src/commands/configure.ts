import { log, info } from '../utils/logger';
import { ConfigArguments } from '../utils/types';
import { SSC_RC_PATH, PLATFORM_URL } from '../utils/helpers';
import * as rc from '../utils/rc';
import * as inquires from '../utils/inquires';

const message: string = 'What environment do you want to configure?';

const setToken = async (
  rcPath: string,
  {
    env,
    token,
  }: {
    env: string;
    token: string;
  },
): Promise<void> => rc.writeRc(rcPath, { ...rc.readRc(rcPath), ...{ [env]: { token } } });

const configure = async (args: ConfigArguments) => {
  const env: string = args.environment ? 'production' : (await inquires.askEnvironment(message)).environment;
  log(info('\nYou can generate an API token in the following url', `\n${PLATFORM_URL[env]}/my-settings/api`));
  const token: string = args?.token || (await inquires.askToken()).token;
  const existsToken = !!rc.readRc(SSC_RC_PATH)[env]?.token;
  const replaceToken: boolean = existsToken && (await inquires.askTokenReplacement()).replace;

  // escape the workflow since we dont want to replace the token
  if (existsToken && !replaceToken) {
    log(info('Token replacement cancelled!'));
    return;
  }

  await setToken(SSC_RC_PATH, { env, token });

  log(info('Token successfully set!'));
};

export default configure;
