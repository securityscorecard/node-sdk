import os from 'os';

export const SSC_MANIFEST: string = './manifest.json';
export const SSC_RC_PATH: string = `${os.homedir()}/.sscrc`;
export const ENVIROMENTS: string[] = ['production', 'testing', 'development'];

export const API: { [key: string]: string } = {
  production: 'https://platform-api.securityscorecard.io',
  testing: 'https://platform-api.securityscorecard.qa',
  development: 'https://platform-api.securityscorecard.tech',
};

export const PLATFORM_URL: { [key: string]: string } = {
  production: 'https://platform.securityscorecard.io/#i',
  testing: 'https://platform.securityscorecard.qa/#',
  development: 'https://platform.securityscorecard.tech/#',
};
