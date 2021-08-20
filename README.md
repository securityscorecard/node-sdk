# node-sdk

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

IMPORTANT DISCLAIMER: this is still in an experimental phase, please do not use this in a real SecurityScorecard app yet.

- SecurityScorecard open-source node SDK, built to help developers [build SecurityScorecard apps](https://securityscorecard.readme.io/docs/build-an-app)
- a multi-package repository, including an SDK library, a CLI, and multiple code examples
- each package is versioned (semver) and published separately under the `@securityscorecard` namespace

## contributing

during this experimental phase pull requests are not going to be received, once we go live we'll include details contributing guidelines here.

## development workflow

Create/edit packages in `packages` folder. Use existing packages (like env) as template

Once you are done with development, commit everything to local branch and call `yarn new-version`.
This will update package.json version and update changelog based on your commits.
Once your PR is merged to master, package will be published automatically.
