import ora from 'ora';
import apps from '../services/apps';
import * as inquires from '../utils/inquires';
import * as rc from '../utils/rc';
import { SSC_RC_PATH } from '../utils/helpers';
import { error, info, log } from '../utils/logger';
import { SubscriptionList } from '../utils/types';
import { askEventToSimulate, askForFakeEvent } from '../utils/inquires';

const operationGetSubscriptions = 'Getting Rules';
const operationSimulateRule = 'Simulating Rule';
const message: string = 'In which environment do you want to trigger the event?';

const simulate = async (args: { environment: string }) => {
  const env: string = args.environment ? 'production' : (await inquires.askEnvironment(message)).environment;
  const token: string = rc.readRc(SSC_RC_PATH)[env]?.token!;
  const gettingSubscriptions = ora(operationGetSubscriptions).start();

  if (!token) {
    gettingSubscriptions.fail();
    log(error(`No token found for ${env}, you must set your config first`));
    log(error('ie.: ssc config'));
    return;
  }

  const subscriptions = (await apps.subscriptions({ token, env })) as SubscriptionList;
  const availableSubscriptions = subscriptions?.entries?.filter(s => !s.delivery.workflow.hidden) || [];

  if (!availableSubscriptions.length) {
    gettingSubscriptions.fail();
    log(error('\nNo rules found!'));
    log(info('Creation of new rules could be done on https://platform.securityscorecard.io/#/my-settings/rules'));
    return;
  }

  gettingSubscriptions.succeed();
  const availableRules = availableSubscriptions.map(s => ({
    id: s.id,
    // @ts-ignore
    type: s.event_type,
    name: s.delivery.workflow.name,
  }));
  const selection = await askEventToSimulate(
    availableRules.map(e => ({
      name: e.name,
    })),
  );
  const rule = availableRules.find(r => r.name === selection.rule);
  const eventTrial = await askForFakeEvent();
  const simulating = ora(operationSimulateRule).start();
  const fakeEvent = JSON.parse(eventTrial.fake);
  log(info('\nSimulating:\n', JSON.stringify(fakeEvent)));

  try {
    const event = await apps.events({
      token,
      env,
      ruleId: rule!.id,
      type: rule!.type,
      event: fakeEvent,
    });

    simulating.succeed();

    if (event!.received) log(info('🦾 Rule event triggered, check your app logs!'));
  } catch (err) {
    simulating.fail();
    log(error('Something went wrong.', err));
  }
};

export default simulate;
