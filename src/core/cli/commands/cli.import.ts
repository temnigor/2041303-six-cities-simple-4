import TSVFileReader from '../../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from '../interface/cli-command-interface.js';
import { createOffer } from '../../helpers/create-offer.js';

export default class CliImport implements CliCommandInterface {
    public readonly name = '--import';

    private onLine(offerString: string) {
        const offer = createOffer(offerString);
        console.log(offer);
    }

    private onComplete(offerCount: number) {
        console.log(offerCount);
    }

    public execute(fileName: string): void {
        const fileReader = new TSVFileReader(fileName);

        fileReader.on('line', this.onLine);
        fileReader.on('end', this.onComplete);

        try {
            fileReader.read();
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }
            console.log(error.message);
        }
    }
}
