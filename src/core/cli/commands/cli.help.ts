import chalk from 'chalk';
import { CliCommandInterface } from '../interface/cli-command-interface.js';

export default class CliHelp implements CliCommandInterface {
    public readonly name = '--help';

    public async execute(): Promise<void> {
        console.log(
            chalk.blue(
                `Программа для подготовки данных для REST API сервера.

      Команды:
      --version:                   # выводит номер версии
      --help:                      # печатает этот текст
      --import <path>:             # импортирует данные из TSV
      --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных

      Пример:
            main.js --<command> [--arguments]`,
            ),
        );
    }
}
