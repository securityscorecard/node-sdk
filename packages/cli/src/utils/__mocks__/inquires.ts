/* eslint-disable no-underscore-dangle */
const inquires: any = jest.createMockFromModule('../inquires');
const originalModule = jest.requireActual('../inquires');

let mockedExample = Object.create(null);
let mockedOverride = false;

const __setMockExample = (example: string[]) => {
  mockedExample = {
    example,
  };
};

const __setOverridingResponse = (override: boolean) => {
  mockedOverride = override;
};

const askExampleSelection = () => Promise.resolve(mockedExample);
const askExtractionOverride = () => Promise.resolve(mockedOverride);

inquires.askExampleSelection = askExampleSelection;
inquires.askExtractionOverride = askExtractionOverride;
inquires.__setMockExample = __setMockExample;
inquires.__setOverridingResponse = __setOverridingResponse;

module.exports = { ...originalModule, ...inquires };
