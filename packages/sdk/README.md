# SDK

## Getting Started

```js
const { SSC } = require('@securitysorecard/sdk');

const ssc = SSC({ token: 'YOUR_API_ROKEN', host: '', timeout: ''});
```

## Installation Resources

```js
// install the app in your account
ssc.apps.install({url: 'app_manifest_url'})
    .then(appInfo => console.log('App succesfully installed', appInfo));

// update app installation data
ssc.apps.updateInstallationData('installation_code', [{'secret_1': 'value'}])
    .then(completeInstallationResponse => console.log('Installation data successfully updated', completeInstallationResponse));
```

## Signal Resources

```js
// send signals
ssc.apps.sendSignals('app_namespace.signal_type', [{...signal1}, {...signal2}])
    .then(signalsResponse => console.log('Signals emmited, check the response for failures', signalsResponse));

```

## Subscriptions Resources

```js
// send signals
ssc.subscriptions.owned().then(subscriptions => console.log('List of owned subscriptions', signalsResponse));
```

## Events Resources

```js
// send signals
ssc.events.trigger(({ 
  ruleId: 'unique_id',
  type: 'scorecard.changed',
  event: <EVENT_DETAILS>,
})).then(({ received }) => console.log('Rule trial', received));
```
