import ora from 'ora';
import * as rc from '../utils/rc';
import * as inquires from '../utils/inquires';
import { InstallArguments } from '../utils/types';
import { log, error, info } from '../utils/logger';
import { SSC_MANIFEST, SSC_RC_PATH, PLATFORM_URL } from '../utils/helpers';
import apps from '../services/apps';

const message: string = 'In which environment do you want to install?';

const install = async (args: InstallArguments) => {
  const operation = 'Installing App';
  const url: string = args.url || rc.urlFromManifest(SSC_MANIFEST);
  const env: string = args.environment ? 'production' : (await inquires.askEnvironment(message)).environment;
  const spinner = ora(operation).start();

  if (!url) {
    log(error('No manifest found or URL config'));
    log(error('ie.: ssc install -u <YOUR_URL>'));
    spinner.fail(operation);
    return;
  }

  const token: string = rc.readRc(SSC_RC_PATH)[env]?.token!;

  if (!token) {
    log(error(`No token found for ${env}, you must set your config first`));
    log(error('ie.: ssc config'));
    spinner.fail(operation);
    return;
  }

  try {
    // install the app in your account
    const appInfo = await apps.install({ token, env, url });

    spinner.succeed(operation);
    log(
      info(
        '\n🚀 Congratulations, now you can find your application at',
        `\n${PLATFORM_URL[env]}/marketplace/${appInfo.id}`,
      ),
    );
  } catch (err) {
    spinner.fail(operation);
    log(error('Something went wrong.', err));
  }
};

export default install;
