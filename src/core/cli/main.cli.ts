#!/usr/bin/env node
import CliApplication from './cli.application.js';
import CliHelp from './commands/cli.help.js';
import CliImport from './commands/cli.import.js';
import CliVersion from './commands/cli.version.js';

const cli = new CliApplication();

cli.registerCommand([new CliHelp(), new CliVersion(), new CliImport()]);
cli.processCommand(process.argv);
