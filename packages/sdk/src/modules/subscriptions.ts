import { HTTPMethod, SecurityScorecardApi } from '../types';
import { User, SubscriptionsModule, SubscriptionList } from './types';

export default function Subscriptions(api: SecurityScorecardApi): SubscriptionsModule {
  return {
    name: 'Subscriptions',
    async owned(): Promise<SubscriptionList> {
      const user = await api.apiCall<User>('/myself', {
        method: HTTPMethod.GET,
      });

      const subscriptions = await api.apiCall<SubscriptionList>('/subscriptions', {
        method: HTTPMethod.GET,
        query: { username: user!.username, page: 1, 'page-size': 50 },
      });

      return subscriptions;
    },
  };
}
