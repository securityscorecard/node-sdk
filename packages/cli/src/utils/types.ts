import pacote from 'pacote';

export type Enviroment = 'production' | 'testing' | 'development';

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
  environment: boolean;
};

export type RunCommandSettings = {
  token?: string;
};

export type IRunCommand = {
  [key: string]: RunCommandSettings;
};

export type InstallArguments = {
  url?: string;
  environment: boolean;
};

export type SubscriptionList = {
  entries: {
    id: string;
    /* eslint-disable  camelcase */
    paused_at: string;
    event_type: string;
    delivery: { workflow: any };
    external_edit_url: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    /* eslint-enable  camelcase */
  }[];
  size: number;
};
