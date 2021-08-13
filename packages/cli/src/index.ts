import { program } from 'commander';
import { title, log } from './utils/logger';
import init from './commands/init';

program.version('0.0.1');

log(title('🛡️ SecurityScorecard'));

program
  .command('init')
  .description('choose your example to begin with')
  .option('-e, --example [value]', 'Example Name')
  .option('-folder, --folder [value]', 'Extraction Folder')
  .action(init);

program.parse(process.argv);
