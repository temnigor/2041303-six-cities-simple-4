import { MockData } from '../../../types/mock-data.type';
import { CliCommandInterface } from '../interface/cli-command-interface.js';
import got from 'got';
import { OfferGenerator } from '../../../modules/offer-generator/offer-generator.js';
import { FileWriter } from '../../file-writer/file-writer.js';

export default class CliGenerateOffers implements CliCommandInterface {
    public readonly name = '--generate';
    private initialData!: MockData;

    public async execute(...parameters: string[]): Promise<void> {
        const [count, filepath, url] = parameters;
        const offerCount = Number.parseInt(count, 10);

        try {
            this.initialData = await got.get(url).json();
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }

        const offer = new OfferGenerator(this.initialData);
        const writer = new FileWriter(filepath);

        for (let i = 0; i < offerCount; i++) {
            writer.write(offer.generate());
        }
        console.log(`file ${filepath} create`);
    }
}
