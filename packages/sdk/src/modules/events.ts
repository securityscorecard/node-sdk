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
      if (!TriggerRequest.realEvent && !TriggerRequest.ruleId) throw new Error('A ruleId is required!');

      const dispatch = await api.apiCall<{ received: boolean }>(`/events/${TriggerRequest.type}`, {
        method: HTTPMethod.POST,
        body: TriggerRequest.realEvent
          ? TriggerRequest.event
          : { ...TriggerRequest.event, trial: { rule_id: TriggerRequest.ruleId } },
      });

      return dispatch;
    },
  };
}
