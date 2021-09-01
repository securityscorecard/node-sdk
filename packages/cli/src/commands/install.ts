import fs from 'fs';
import ora from 'ora';
import request from 'superagent';
import { readRc } from '../utils/rc';
import { InstallArguments } from '../utils/types';
import { log, error, info } from '../utils/logger';
import { SSC_MANIFEST, SSC_RC_PATH, API, PLATFORM_URL } from '../utils/helpers';

const urlFromManifest = (): string =>
  fs.existsSync(SSC_MANIFEST) && JSON.parse(fs.readFileSync(SSC_MANIFEST, 'utf8')).url;

const install = async (args: InstallArguments) => {
  const operation = 'Installing App';
  const url: string = args?.url || urlFromManifest();
  const env: string = args?.enviroment!;
  const spinner = ora(operation).start();

  if (!env) {
    log(error('Please, provide the enviroment you want to install the app'));
    log(error('ie.: ssc install -e <ENVIROMENT>'));
    return;
  }

  if (!url) {
    log(error('No manifest found or URL config'));
    log(error('ie.: ssc install -e <ENVIROMENT> -u <YOUR_URL>'));
    return;
  }

  const token: string = readRc(SSC_RC_PATH)[env]?.token!;

  if (!token) {
    log(error(`No token found for ${env}, you must set your config first`));
    log(error('ie.: ssc config'));
    return;
  }

  try {
    const { body } = await request('POST', `${API[env]}/apps`)
      .set({
        Authorization: `Token ${token}`,
      })
      .set('Content-Type', 'application/json')
      .send({ url });

    spinner.succeed(operation);
    log(
      info(
        '\n🚀 Congratulations, now you can find your application at',
        `\n${PLATFORM_URL[env]}/marketplace/${body.id}`,
      ),
    );
  } catch (err) {
    spinner.fail(operation);
    log(error('Something went wrong.', err));
  }
};

export default install;
