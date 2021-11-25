import ora from 'ora';
import apps from '../services/apps';
import * as inquires from '../utils/inquires';
import * as rc from '../utils/rc';
import { SSC_RC_PATH } from '../utils/helpers';
import { error, info, log } from '../utils/logger';
import { SubscriptionList } from '../utils/types';
import { askEventToSimulate, askForFakeEvent } from '../utils/inquires';
import { load as loadJSON } from '../utils/json';

const operationGetSubscriptions = 'Getting Rules';
const operationSimulateRule = 'Simulating Rule';
const operationLoadingFile = 'Loading event from file';
const message: string = 'In which environment do you want to trigger the event?';

const simulate = async (args: { environment: boolean; file: string }) => {
  const env: string = args.environment ? 'production' : (await inquires.askEnvironment(message)).environment;
  const token: string = rc.readRc(SSC_RC_PATH)[env]?.token!;
  const filePath: string = args.file;

  let fakeEvent;

  if (filePath) {
    const loadingFile = ora(operationLoadingFile).start();
    try {
      fakeEvent = loadJSON(filePath);
      loadingFile.succeed();
    } catch (err) {
      loadingFile.fail();
      log(error('Invalid file arg'));
      log(error(err.message));
      return;
    }
  }

  const gettingSubscriptions = ora(operationGetSubscriptions).start();

  if (!token) {
    gettingSubscriptions.fail();
    log(error(`No token found for ${env}, you must set your config first`));
    log(error('ie.: ssc config'));
    return;
  }

  let subscriptions: SubscriptionList = {} as SubscriptionList;

  try {
    subscriptions = (await apps.subscriptions({ token, env })) as SubscriptionList;
  } catch (err) {
    gettingSubscriptions.fail();
    log(error('API error'));
    log(error(`Error: ${err.message}`));
    return;
  }

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

  if (!fakeEvent) {
    try {
      const rawEvent = await askForFakeEvent();
      fakeEvent = JSON.parse(rawEvent);
    } catch (err) {
      log(error('Invalid fake event'));
      return;
    }
  }

  const simulating = ora(operationSimulateRule).start();
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
