import Modules from './modules';
import Api from './api';
import { SecurityScorecardSDK } from './types';
import envConfigs from './configs';
import { normalizeUrl } from './utils';

// eslint-disable-next-line no-shadow
export const API_HOST_NAMES: { [key: string]: string } = {
  production: 'https://platform-api.securityscorecard.io',
  testing: 'https://platform-api.securityscorecard.qa',
  development: 'https://platform-api.securityscorecard.tech',
};

const normalizeHost = (host: string) => {
  // check if its one of known hosts
  const knownHost = API_HOST_NAMES[host];
  try {
    const normalizedHost = normalizeUrl(knownHost || host);
    return normalizedHost;
  } catch (error) {
    throw new Error(`please provide a valid host either [${Object.keys(API_HOST_NAMES)}] or any valid url.`);
  }
};

export function SSC(
  config: {
    token?: string;
    host?: string;
    timeout?: number;
  } = {},
): SecurityScorecardSDK {
  const token = config.token || envConfigs.token;

  if (!token) throw new Error('must provide an api token, or have one set as environment variable "SSC_API_TOKEN"');

  const host = normalizeHost(config.host || envConfigs.host || 'production');

  // Create an api to interact with securityscorecard
  const api = new Api(token, {
    host,
  });

  // Initialize modules
  const apps = Modules.Apps(api);
  const subscriptions = Modules.Subscriptions(api);
  const events = Modules.Events(api);

  return {
    api,
    apps,
    events,
    subscriptions,
  };
}
