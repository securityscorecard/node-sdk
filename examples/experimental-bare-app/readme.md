# Experimental 

## Bare app

**IMPORTANT DISCLAIMER**: this is still in an experimental phase, please do not use this in a real SecurityScorecard app yet.

Basic app used to demostrate the workflow of SecurityScorecard's Marketplace.

### Getting Started

**1.- Create a [SecurityScorecard API Token](https://platform.securityscorecard.tech/#/my-settings/api). Select `Generate new API token` (copy the result)**

**2.- Configure your CLI token**

```
ssc config
```

> during the process specify wich enviroment you want to set 

**3.- Initialize your project**

```
ssc init -e experimental-bare-app
```

**4.- Modify the manifest at `/public/manifest.json` with your details**

```
{
    // Your projects name
    "name": "Experimental Bare App",
    // A description text that will be visualized on a thumbnail
    "description": "experimental bare app",
    // A description text that will be visualized on yours app details
    "long_description": "app only for experimental purposes only",
    // URL where you contain/expose your manifest
    "url": "example.com/where/manifest/is/located",
    // Base URL of your project
    "homepage": "https://example.com",
    // Developer site/name
    "developer": "company.com",
    // A URL with your projects/company logo
    "logo_url": "https://example.com/assets/image.gif"
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

