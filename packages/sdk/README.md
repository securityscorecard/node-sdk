# SDK

## Example usage
```js
const { SSC } = require('@securitysorecard/sdk');

const ssc = SSC({ token: 'YOUR_API_ROKEN'});

// install the app in your account
ssc.apps.install({url: 'app_manifest_url'})
    .then(appInfo => console.log('App succesfully installed', appInfo));

// send signals
ssc.apps.sendSignals('app_name_sapece.signal_type', [{...signal1}, {...signal2}])
    .then(signalsResponse => console.log('Signals emmited, check the response for failures', signalsResponse));

// update app installation data
ssc.apps.updateInstallationData('installation_code', [{'secret_1': 'value'}])
    .then(completeInstallationResponse => console.log('Installation data successfully updated', completeInstallationResponse));
```