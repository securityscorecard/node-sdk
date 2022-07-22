import fs from 'fs';
import ora from 'ora';
import pacote from 'pacote';
import * as inquires from '../utils/inquires';
import { log, info, details, error } from '../utils/logger';
import { ExampleExtractor, ExampleItem, IInitArguments, IPackageManifest } from '../utils/types';
import { CLIError } from '../utils/errors';

const NPM_SSC = '@securityscorecard/';
const CLI_MANIFEST = `${NPM_SSC}cli-manifest`;

export const fetchExampleList = async (): Promise<ExampleItem[] | undefined> => {
  let exampleList: ExampleItem[] = [];
  const operation = 'Fetching examples';
  const spinner = ora(operation).start();

  try {
    const response = (await pacote.manifest(CLI_MANIFEST, {
      fullMetadata: true,
    })) as IPackageManifest;
    // @ts-ignore
    exampleList = [...response?.apps.experiments!, ...response?.apps.examples!];
    spinner.succeed(operation);
  } catch (e) {
    spinner.fail(operation);
    log(error('Could not fetch example list'));
    throw new CLIError('Could not fetch example list');
  }

  return exampleList;
};

const stepsToFollow = (folder: string) => {
  log(info('\n🎉 Now you are able to open your project, run:', `\n $ cd ${folder}`));
  log(
    info(
      '\nAlso, you could follow the installation steps:',
      '\nhttps://securityscorecard.readme.io/docs/creating-an-app',
    ),
  );
};

export const extractExample = async ({ path, name, folder }: ExampleExtractor): Promise<void> => {
  const operation = `Extracting example ${name} into ${folder}`;
  const spinner = ora(operation).start();

  try {
    // if manifest not found then the package does not exists
    await pacote.manifest(path);
    // this prevents the extract to create a folder before throwing
    // since pacote wont rimraf on extract failing
    await pacote.extract(path, folder);
    spinner.succeed(operation);
    stepsToFollow(folder);
  } catch (e) {
    spinner.fail(operation);
    log(error('Could not extract example'));
    throw new CLIError('Could not extract example', [e]);
  }
};

const choseExample = async (): Promise<string> => {
  const examples = (await fetchExampleList()) as ExampleItem[];
  log(details(`${examples.length} examples found`));
  const answer = await inquires.askExampleSelection(examples);
  return answer.example!;
};

export const initialize = async (args: IInitArguments): Promise<void> => {
  const exampleName: string = args?.example! || (await choseExample());
  log(info('\nInitializing example:'), exampleName);
  const path = `${NPM_SSC}${exampleName}`;
  const folderName = args.folder || exampleName;
  const folderExists = fs.existsSync(folderName);
  const isOverriding = folderExists && (await inquires.askExtractionOverride(folderName));

  if (!folderExists || isOverriding) {
    await extractExample({ path, name: exampleName, folder: folderName });
  } else {
    log(info('Remember you could always:'), 'ssc init -f <folder_name>');
  }
};
