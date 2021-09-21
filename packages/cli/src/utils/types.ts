import pacote from 'pacote';

export type Example = {
  example?: string;
};

export interface IInitArguments extends Example {
  folder?: string;
}

export type ExampleItem = {
  name: string;
};

export type ExampleExtractor = {
  path: string;
  name: string;
  folder: string;
};

export type ValidateExtraction = {
  continue: boolean;
};

export interface IPackageManifest extends pacote.ManifestResult {
  apps: {
    experiments?: ExampleItem[];
    examples?: ExampleItem[];
  };
}

export type ConfigArguments = {
  token?: string;
  enviroment: boolean;
};

export type RunCommandSettings = {
  token?: string;
};

export interface IRunCommand {
  [key: string]: RunCommandSettings;
}

export type InstallArguments = {
  url?: string;
  enviroment: boolean;
};
