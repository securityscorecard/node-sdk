// eslint-disable-next-line import/no-extraneous-dependencies
import nock, { Options } from 'nock';

export const start = () => {
  if (!nock.isActive()) nock.activate();
  nock.disableNetConnect();
  return nock;
};

export const stop = () => {
  if (nock.isActive()) {
    nock.cleanAll();
    nock.abortPendingRequests();
    nock.restore();
  }
  return nock;
};

export const MOCK_SERVER_URL = 'https://platform-api.securityscorecard.mock';

export const listenMockServer = (config?: { serverUrl?: string; options?: Options }) =>
  start()(config?.serverUrl || MOCK_SERVER_URL, config?.options);
