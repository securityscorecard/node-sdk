import fs from 'fs';
import ora from 'ora';
import pacote from 'pacote';
import inquirer from 'inquirer';
import { log, info, details, error } from '../utils/logger';
import {
  IExample,
  IExampleExtractor,
  IExampleItem,
  IInitArguments,
  IValidateExtraction,
  IPackageManifest
} from './types';

const NPM_SSC = '@securityscorecard/'
const CLI_MANIFEST = `${NPM_SSC}cli-manifest`;

const fetchExampleList = async (): Promise<IExampleItem[] | undefined> => {
  let exampleList: IExampleItem[] = [];
  const operation = 'Fetching examples';
  const spinner = ora(operation).start();

  try {
    const response = await pacote.manifest(CLI_MANIFEST, { fullMetadata: true } ) as IPackageManifest;
    exampleList = [...response?.apps.experiments!, ...response?.apps.examples!]
    spinner.succeed(operation);
  } catch (err) {
    spinner.fail(operation);
    log(error('Could not fetch example list'), { err });
  }

  return exampleList;
};

const extractExample = async ({ path, name, folder }: IExampleExtractor) => {
  const operation = `Extracting example: ${name}`;
  const spinner = ora(operation).start();
  try {
    await pacote.extract(path, folder);
    spinner.succeed(operation);
  } catch (e) {
    spinner.fail(operation);
    log(error('Could not extract example'), e.stderr);
  }
};

const displayExampleSelector = (examples: IExampleItem[]): Promise<IExample> =>
  inquirer.prompt([
    {
      type: 'list',
      name: 'example',
      message: 'Which base template would you like to use?',
      choices: examples.map(example => example?.name),
    },
  ]);

const choseExample = async (): Promise<string> => {
  const examples = (await fetchExampleList()) as IExampleItem[];
  log(details(`${examples.length} examples found`));
  const answer = await displayExampleSelector(examples);
  return answer.example!;
};

const validateExtraction = async (
  folder: string,
): Promise<IValidateExtraction> =>
  fs.existsSync(folder)
    ? inquirer.prompt([
        {
          name: 'continue',
          type: 'confirm',
          message: `The folder ${folder} already exists, do you want to replace it ?`,
          default: false,
        },
      ])
    : { continue: true };

const initialize = async (args: IInitArguments): Promise<void> => {
  let example = args.example!;

  if (!args?.example) {
    example = await choseExample();
  }

  log(info('Initialing example:'), details(example));
  const path = `${NPM_SSC}${example}`;
  const folder = args.folder || example;
  const folderExists = await validateExtraction(folder);

  if (folderExists?.continue) {
    await extractExample({ path, name: example, folder });
  }

};

export default initialize;
