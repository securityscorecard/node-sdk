import pacote from 'pacote';

export interface IExample {
  example?: string;
}
export interface IInitArguments extends IExample {
  folder?: string;
}

export interface IExampleItem {
  name: string;
}

export interface IExampleExtractor {
  path: string;
  name: string;
  folder: string;
}

export interface IValidateExtraction {
  continue: boolean;
}

export interface IPackageManifest extends pacote.ManifestResult {
  apps: {
    experiments?: IExampleItem[];
    examples?: IExampleItem[];
  };
}

export interface IConfigArguments {
  token?: string;
}

export interface IRunCommandSettings {
  token?: string;
}

export interface IRunCommand {
  [key: string]: IRunCommandSettings;
}

export interface IInstallArguments {
  url?: string;
  enviroment?: string;
}
