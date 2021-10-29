import inquirer from 'inquirer';
import { ENVIRONMENTS } from './helpers';
import { ValidateExtraction, ExampleItem, Example, Enviroment } from './types';
import { error, log } from './logger';

export const askExampleSelection = (examples: ExampleItem[]): Promise<Example> =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'example',
      message: 'Which base template would you like to use?',
      choices: examples.map(example => example?.name),
    },
  ]);

export const askExtractionOverride = async (folder: string): Promise<ValidateExtraction> =>
  inquirer.prompt([
    {
      name: 'continue',
      type: 'confirm',
      message: `The folder ${folder} already exists, do you want to replace it ?`,
      default: false,
    },
  ]);

export const askToken = (): Promise<{ token: string }> =>
  inquirer.prompt([
    {
      name: 'token',
      type: 'input',
      message: 'You need to provide an API token',
    },
  ]);

export const askTokenReplacement = (): Promise<{ replace: boolean }> =>
  inquirer.prompt([
    {
      name: 'replace',
      type: 'confirm',
      message: 'You already have a token configured, do you want to replace it?',
      default: false,
    },
  ]);

export const askEnvironment = (
  message: string,
): Promise<{
  environment: Enviroment;
}> =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'environment',
      message,
      choices: ENVIRONMENTS,
    },
  ]);

export const askEventToSimulate = (rules: { name: any }[]): Promise<{ rule: string }> =>
  inquirer.prompt([
    {
      type: 'list',
      message: 'Select rule to simulate',
      name: 'rule',
      choices: rules,
    },
  ]);

export const askForFakeEvent = () =>
  inquirer.prompt([
    {
      type: 'editor',
      name: 'fake',
      message: 'Add a fake event to trigger!',
      validate(event) {
        try {
          JSON.parse(event);
        } catch (err) {
          log(error('error while parsing event'));
        }
        return true;
      },
    },
  ]);
