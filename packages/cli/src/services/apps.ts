import { SSC } from '@securityscorecard/sdk';
import { API } from '../utils/helpers';
import { SubscriptionList } from '../utils/types';

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

const subscriptions = async ({ token, env }: { token: string; env: string }): Promise<SubscriptionList | undefined> => {
  const ssc = SSC({ token, host: API[env] });
  const subscriptionsOwned = await ssc.subscriptions.owned();
  return subscriptionsOwned;
};

const events = async ({
  token,
  env,
  ruleId,
  type,
  event,
}: {
  token: string;
  env: string;
  ruleId: string;
  type: string;
  event: any;
}): Promise<{ received: boolean } | undefined> => {
  const ssc = SSC({ token, host: API[env] });
  const eventTrigger = await ssc.events.trigger({ ruleId, type, event, realEvent: false });
  return eventTrigger;
};

export default { install, validate, events, subscriptions };
