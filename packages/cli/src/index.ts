import { program } from 'commander';
import { title, log } from './utils/logger';
import { initialize } from './commands/initialize';
import configure from './commands/configure';
import install from './commands/install';
import validate from './commands/validate';

program.version('0.0.1');

log(title('SecurityScorecard'));

program
  .command('init')
  .description('choose your example to begin with')
  .option('-e, --example [value]', 'Example Name')
  .option('-f, --folder [value]', 'Extraction Folder')
  .action(initialize);

program
  .command('config')
  .description('set your SecurityScorecard credentials')
  .option('--no-environment', 'no environment selected')
  .option('-t, --token [value]', 'API Token')
  .action(configure);

program
  .command('install')
  .description('install your app on the marketplace')
  .option('--no-environment', 'no environment selected')
  .option('-u, --url [value]', 'URL where manifest is published')
  .action(install);

program
  .command('validate')
  .description('validate your app manifest on the marketplace')
  .option('--no-environment', 'no environment selected')
  .option('-u, --url [value]', 'URL where manifest is published')
  .action(validate);

program.parse(process.argv);
