import { CliCommandInterface } from './interface/cli-command-interface.js';

type ParsedCommand = {
    [key: string]: string[];
};

export default class CliApplication {
    private commandList: { [commandName: string]: CliCommandInterface } = {};
    private defaultCommands = '--help';

    public registerCommand(commands: CliCommandInterface[]) {
        commands.forEach(command => (this.commandList[command.name] = command));
    }

    private parseCommand(cliArguments: string[]): ParsedCommand {
        const parsedCommand: ParsedCommand = {};
        let command = '';
        return cliArguments.reduce((acc, item) => {
            if (item.startsWith('--')) {
                acc[item] = [];
                command = item;
            } else if (command && item) {
                acc[command].push(item);
            }
            return acc;
        }, parsedCommand);
    }

    public getCommand(commandName: string): CliCommandInterface {
        return (
            this.commandList[commandName] ??
            this.commandList[this.defaultCommands]
        );
    }

    public processCommand(argv: string[]): void {
        const parsedCommand = this.parseCommand(argv);
        const [commandName] = Object.keys(parsedCommand);
        const command = this.getCommand(commandName);
        const commandArguments = parsedCommand[commandName] ?? [];
        command.execute(...commandArguments);
    }
}
