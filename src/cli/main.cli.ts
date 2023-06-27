#!/usr/bin/env node
import 'reflect-metadata';
import CliApplication from './cli.application.js';
import CliGenerateOffers from './commands/cli.generate-offers.js';
import CliHelp from './commands/cli.help.js';
import CliImport from './commands/cli.import.js';
import CliVersion from './commands/cli.version.js';

const cli = new CliApplication();

cli.registerCommand([
    new CliHelp(),
    new CliVersion(),
    new CliImport(),
    new CliGenerateOffers(),
]);
cli.processCommand(process.argv);
