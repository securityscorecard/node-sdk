# Experimental 

## Action app

**IMPORTANT DISCLAIMER**: this is still in an experimental phase, please do not use this in a real SecurityScorecard app yet.

Action Action app used to demostrate the workflow of SecurityScorecard's Marketplace.

One of the ways apps can extend our platform is by registering additional actions that can be invoked in Rules.

### Getting Started

**1.- Create a [SecurityScorecard API Token](https://platform.securityscorecard.tech/#/my-settings/api). Select `Generate new API token` (copy the result)**

**2.- Configure your CLI token**

```
ssc config
```

> during the process specify wich enviroment you want to set 

**3.- Initialize your project**

```
ssc init -e experimental-action-app
```

**4.- Modify the manifest at `/public/manifest.json` with your details**

If you are not familiar with the manifest, you should also check the `experimental-bare-app` example that already explains the basics

```
{
  ...
  "actions": [
    {
      // unique identifier for this action (must be snake_case)
      "id": "notify_channel",
      // human-readable description of this action
      "name": "Notify Channel",
      // the url in your app that will be called (POST) to execute this action
      // note: as other urls, this can be relative to the manifest url
      "url": "actions/notify_channel",
      // optional, url to call (POST) for settings to show in the rule builder
      "settings_url": "actions/notify_channel/settings",
      // optional, instead of the above, when settings are fixed (independent of user)
      "settings": {
        // example field to show in the rule builder (will be shown as dropdown)
        "department": {
          "options": [{
            "key": "it",
            "value": "IT"
          }, {
            "key": "sec-ops",
            "value": "SecOps"
          }]
        }
      }
    }
  ]
}
```

**5.- Deploy your app**

- use already provided example with Vercel (`vercel.json`) or any cloud provider you like.

**6.- Install your app**

Inside your projects manifest route (ex. `/public/manifest`)

```
ssc install -e development
```

> the CLI will display the URL where your project is, but you could also find it throug SecurityScorecard > Marketplace > (filter) Installed Apps

**7.- Create a new Rule**

Navigate to [SecurityScorecard > My Settings > Rules](https://platform.securityscorecard.tech/#/my-settings/rules). Then, select `+ Create my own rule`.

The ui display three dropdowns, each one refers to a property that the rule builder will take into consideration, `event`, `for` and `action`. To use our app we need to provide a new rule setting the `action` dropdown to use our new event `Notify Channel` (ref.: `manifest.json > name`).

**8.- Execute the action**

Now all the events triggering the condition we set on our rule will call our action url (ref.: `manifest.json > url`).

