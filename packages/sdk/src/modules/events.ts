import { HTTPMethod, SecurityScorecardApi } from '../types';
import { EventsModule } from './types';

export default function Events(api: SecurityScorecardApi): EventsModule {
  return {
    name: 'Events',
    async trigger(TriggerRequest: {
      type: string;
      ruleId?: string;
      event: any;
      realEvent?: boolean;
    }): Promise<{ received: boolean } | undefined> {
      const rule = TriggerRequest.ruleId;
      const isReal = TriggerRequest.realEvent;
      if (!isReal && !rule) throw new Error('A ruleId is required!');

      const { type, event } = TriggerRequest;

      const dispatch = await api.apiCall<{ received: boolean }>(`/events/${type}`, {
        method: HTTPMethod.POST,
        body: isReal ? event : { ...event, trial: { ruleId: rule } },
      });

      return dispatch;
    },
  };
}
