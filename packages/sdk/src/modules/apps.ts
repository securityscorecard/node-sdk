import snakecaseKeys from 'snakecase-keys';
import { HTTPMethod, SecurityScorecardApi } from '../types';
import { AppsModule } from './types';

export default function Apps(api: SecurityScorecardApi): AppsModule {
  return {
    name: 'Apps',
    async install(InstallRequest: { url: string }): Promise<{ id: string; url: string; name: string }> {
      const app = await api.apiCall<{ id: string; url: string; name: string }>('/apps', {
        method: HTTPMethod.POST,
        body: { url: InstallRequest.url },
      });
      if (!app) throw new Error('Unable to install app, expected to receive app info but nothing was returned');
      return app;
    },
    async sendSignals(
      signalType: string,
      signals: {
        url?: string;
        domain: string;
        ip?: string;
        count?: number;
        summary: string;
        lastSeen?: string;
        status?: 'processing' | 'active' | 'resolved' | 'decayed';
      }[] = [],
    ): Promise<{ id?: string; error?: { message: string } }[]> {
      const signalsResult = await api.apiCall<{ id?: string; error?: { message: string } }[]>(
        `/signals/by-type/${signalType}`,
        {
          method: HTTPMethod.PATCH,
          body: [
            ...signals.map(signal => ({
              op: 'add',
              value: snakecaseKeys(signal),
            })),
          ],
        },
      );
      if (!signalsResult) throw new Error('Expected some payload from api');
      return signalsResult;
    },
    async updateInstallationData(installationData: {
      installation: string;
      secrets: { key: string; value: string }[];
      // eslint-disable-next-line camelcase
    }): Promise<{ next_url: string }> {
      // eslint-disable-next-line camelcase
      const installationResponse = await api.apiCall<{ next_url: string }>('/apps/installation-data', {
        method: HTTPMethod.POST,
        body: installationData,
      });
      if (!installationResponse) throw new Error('Expected to receive some data');
      return installationResponse;
    },
  };
}
