import TSVFileReader from '../../fileReader/tsv-file-reader.js';
import { CliCommandInterface } from '../interface/cli-command-interface';

export default class CliImport implements CliCommandInterface {
    public readonly name = '--import';

    public execute(fileName: string): void {
        const fileReader = new TSVFileReader(fileName);
        try {
            console.log(fileReader.toArray());
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }
            console.log(error.message);
        }
    }
}
