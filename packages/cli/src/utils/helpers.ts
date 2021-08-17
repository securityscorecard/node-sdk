import os from 'os';

export const SSC_MANIFEST: string = './manifest.json';
export const SSC_RC_PATH: string = `${os.homedir()}/.sscrc`;
export const ENVIROMENTS: string[] = ['production', 'testing', 'development'];

export const API: { [key: string]: string } = {
  production: '',
  testing: '',
  development: 'https://platform-api.securityscorecard.tech',
};
