export type User = {
  username: string;
  email?: string;
  organization?: {
    domain: string;
    id: string;
  };
  roles?: string[];
  authMechanism?: string;
};

export type Subscription = {
  id: string;
  pausedAt: string;
  eventType: string;
  delivery: { workflow: any };
  externalEditUrl: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

type SecurityScorecardModule = {
  name: string;
};

// Apps Module
export type AppsModule = SecurityScorecardModule & {
  install(req: { url: string }): Promise<{ id: string; url: string; name: string }>;
  validate(req: { url: string }): Promise<{ success: boolean; message: string }>;
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

export type SubscriptionList = { entries: Subscription[]; size: number } | undefined;

export type SubscriptionsModule = SecurityScorecardModule & {
  owned(): Promise<SubscriptionList>;
};

export type EventsModule = SecurityScorecardModule & {
  trigger(req: {
    ruleId?: string;
    type: string;
    event: any;
    realEvent?: boolean;
  }): Promise<{ received: boolean } | undefined>;
};
