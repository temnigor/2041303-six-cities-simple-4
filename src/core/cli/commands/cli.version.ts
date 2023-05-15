import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { CliCommandInterface } from '../interface/cli-command-interface';

export default class CliVersion implements CliCommandInterface {
    public readonly name = '--version';

    private readVersion(): string {
        const data = readFileSync('./package.json', 'utf-8');
        const version = JSON.parse(data).version;
        return version;
    }

    public async execute(): Promise<void> {
        console.log(chalk.green(this.readVersion()));
    }
}
