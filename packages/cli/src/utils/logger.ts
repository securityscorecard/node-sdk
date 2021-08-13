import chalk from 'chalk';

export const { log } = console;

// report messages
export const info = chalk.magenta;
export const title = chalk.bold.green;
export const details = chalk.white;

// status messages
export const error = chalk.bold.red;
export const warning = chalk.keyword('orange');
