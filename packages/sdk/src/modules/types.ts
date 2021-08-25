type SecurityScorecardModule = {
  name: string;
};

// Apps Module
export type AppsModule = SecurityScorecardModule & {
  install(req: { url: string }): Promise<{ id: string; url: string; name: string }>;
  sendSignals(
    signalType: string,
    signals: {
      url?: string;
      domain: string;
      ip?: string;
      count?: number;
      summary: string;
      lastSeen?: string;
      status?: 'processing' | 'active' | 'resolved' | 'decayed';
    }[],
  ): Promise<{ id?: string; error?: { message: string } }[]>;
  updateInstallationData(req: {
    installation: string;
    secrets: { key: string; value: string }[];
    // eslint-disable-next-line camelcase
  }): Promise<{ next_url: string }>;
};
