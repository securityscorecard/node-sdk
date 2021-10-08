/* eslint-disable no-underscore-dangle */
import { IRunCommand } from '../types';

const rc: any = jest.createMockFromModule('../rc');
const originalRc = jest.requireActual('../rc');

let mockedRc: IRunCommand = Object.create(null);
let mockedUrlFromManifest: string | null = null;

const __setRcMock = (data: IRunCommand) => {
  mockedRc = data;
};

const __setUrlFromManifest = (data: string) => {
  mockedUrlFromManifest = data;
};

const readRc = () => mockedRc;
const urlFromManifest = () => mockedUrlFromManifest;

rc.readRc = readRc;
rc.__setMockRc = __setRcMock;
rc.urlFromManifest = urlFromManifest;
rc.__setUrlFromManifest = __setUrlFromManifest;

module.exports = { ...originalRc, ...rc };
