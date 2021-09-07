# Experimental 

## Signal app

**IMPORTANT DISCLAIMER**: this is still in an experimental phase, please do not use this in a real SecurityScorecard app yet.

Signal app used to demostrate the workflow of SecurityScorecard's Marketplace.

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
ssc init -e experimental-signal-app
```

**4.- Modify the manifest at `/public/manifest.json` with your details**

If you are not familiar with the manifest, you should also check the `experimental-bare-app` example that already explains the basics

```
{
  ...
  "signals": [
    {
      // unique identifier for this signal (must be snake_case)
      // note this must be prefixed by your app unique namespace (separated by a dot)
      "id": "your_app.your_signal",
      // human-readable description of this signal
      "name": "Signal Name",
      // only "info" or "positive" are allowed here
      "severity": "positive",
      // one of https://api.securityscorecard.io/metadata/factors
      "factor": "patching_cadence",
      "short_description": "risk or short description of this signal",
      "long_description": "long description of this signal",
      "recommendation": "how to remediate (if negative) or obtain (if positive) this signal",
      // a username (ideally a bot) that is authorized to send these signals
      // (see below "Sending Signals")
      "sent_by": "<a username>",
      // links with more information
      "references": [
            {
                "link": "<url of an article with more information>",
                "text": "human-readable title for this link"
            }, {
                "link": "<url of another article with more information>",
                "text": "human-readable title for this link"
            }
      ]
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