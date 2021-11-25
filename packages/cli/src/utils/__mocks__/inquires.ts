/* eslint-disable no-underscore-dangle */
const inquires: any = jest.createMockFromModule('../inquires');
const originalInquire = jest.requireActual('../inquires');

let mockedExample = Object.create(null);
let mockedOverride = false;
let mockedEnvironment: string | null = null;
let mockedToken: string | null = null;
let mockedTokenReplacement: boolean = false;
let mockedSelectedEvent: string | null = null;
let mockedEventPayload: string | null = null;

const __setMockExample = (example: string[]) => {
  mockedExample = {
    example,
  };
};

const __setOverridingResponse = (override: boolean) => {
  mockedOverride = override;
};

const __setEnvironment = (environment: string) => {
  mockedEnvironment = environment;
};

const __setToken = (token: string) => {
  mockedToken = token;
};

const __setTokenReplacement = (override: boolean) => {
  mockedTokenReplacement = override;
};

const __setAskEventToSimulate = (override: string) => {
  mockedSelectedEvent = override;
};

const __setAskForFakeEvent = (override: string) => {
  mockedEventPayload = override;
};

const askExampleSelection = () => Promise.resolve(mockedExample);
const askExtractionOverride = () => Promise.resolve(mockedOverride);
const askEnvironment = () => Promise.resolve(mockedEnvironment);
const askToken = () => Promise.resolve(mockedToken);
const askTokenReplacement = () => Promise.resolve(mockedTokenReplacement);
const askEventToSimulate = () => Promise.resolve(mockedSelectedEvent);
const askForFakeEvent = () => Promise.resolve(mockedEventPayload);

inquires.askExampleSelection = askExampleSelection;
inquires.askExtractionOverride = askExtractionOverride;
inquires.askEnvironment = askEnvironment;
inquires.askToken = askToken;
inquires.askTokenReplacement = askTokenReplacement;
inquires.askEventToSimulate = askEventToSimulate;
inquires.askForFakeEvent = askForFakeEvent;

inquires.__setMockExample = __setMockExample;
inquires.__setOverridingResponse = __setOverridingResponse;
inquires.__setEnvironment = __setEnvironment;
inquires.__setToken = __setToken;
inquires.__setTokenReplacement = __setTokenReplacement;
inquires.__setAskEventToSimulate = __setAskEventToSimulate;
inquires.__setAskForFakeEvent = __setAskForFakeEvent;

module.exports = { ...originalInquire, ...inquires };
