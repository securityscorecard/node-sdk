import fs from 'fs';
import yaml from 'yaml';
import { IRunCommand } from './types';

export const readRc = (rcPath: string): IRunCommand =>
  fs.existsSync(rcPath) && yaml.parse(fs.readFileSync(rcPath, 'utf8'));

export const writeRc = (rcPath: string, rc: IRunCommand): void => fs.writeFileSync(rcPath, yaml.stringify(rc));

export const urlFromManifest = (manifest: any): string =>
  fs.existsSync(manifest) && JSON.parse(fs.readFileSync(manifest, 'utf8')).url;
