import { SSC } from '@securityscorecard/sdk';
import { API } from '../utils/helpers';

const install = async ({
  token,
  env,
  url,
}: {
  token: string;
  env: string;
  url: string;
}): Promise<{ id: string; url: string; name: string }> => {
  const ssc = SSC({ token, host: API[env] });
  const appInfo = await ssc.apps.install({ url });
  return appInfo;
};

const validate = async ({
  token,
  env,
  url,
}: {
  token: string;
  env: string;
  url: string;
}): Promise<{ success: boolean; message: string }> => {
  const ssc = SSC({ token, host: API[env] });
  const validationResult = await ssc.apps.validate({ url });
  return validationResult;
};

export default { install, validate };
