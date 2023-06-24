import TSVFileReader from '../../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from '../interface/cli-command-interface.js';
import { createOffer } from '../../helpers/create-offer.js';
import { UserService } from '../../../modules/user/user.service.js';
import { UserServiceInterface } from '../../../modules/user/user.service.interface.js';
import { OfferService } from '../../../modules/offer/offer-service.js';
import { OfferServiceInterface } from '../../../modules/offer/offer-service.interface.js';
import { DatabaseClientInterface } from '../../database-client/database-client.interface.js';
import { LoggerInterface } from '../../../app/logger/loger.interfase.js';
import ConsoleLoggerService from '../logger/console.service..js';
import { userModel } from '../../../modules/user/user.entity.js';
import { offerModel } from '../../../modules/offer/offer.entity.js';
import { MongoService } from '../../database-client/mongo-service.js';
import { Offer } from '../../../types/offer.type.js';
import { getMongoURL } from '../../helpers/db-url.js';

const DEFAULT_DB_PORT = '27017';
const DEFAULT_USER_PASSWORD = '123456';

export default class CliImport implements CliCommandInterface {
    public readonly name = '--import';

    private userService!: UserServiceInterface;
    private offerService!: OfferServiceInterface;
    private databaseService!: DatabaseClientInterface;
    private logger!: LoggerInterface;
    private salt!: string;

    constructor() {
        this.onLine = this.onLine.bind(this);
        this.onComplete = this.onComplete.bind(this);

        this.logger = new ConsoleLoggerService();
        this.userService = new UserService(this.logger, userModel);
        this.offerService = new OfferService(this.logger, offerModel);
        this.databaseService = new MongoService(this.logger);
    }

    private async saveOffer(offer: Offer) {
        const user = await this.userService.findOrCreate(
            {
                ...offer.user,
                password: DEFAULT_USER_PASSWORD,
            },
            this.salt,
        );

        await this.offerService.create({
            offerName: offer.offerName,
            description: offer.description,
            date: offer.date,
            town: offer.town,
            previewImage: offer.previewImage,
            premium: offer.premium,
            rating: offer.rating,
            houseType: offer.houseType,
            room: offer.room,
            guest: offer.guest,
            price: offer.price,
            amenity: offer.amenity,
            userId: user.id,
            coordinatesTown: offer.coordinatesTown,
        });
    }

    private async onLine(offerString: string, resolve: () => void) {
        const offer = createOffer(offerString);
        await this.saveOffer(offer);
        resolve();
    }

    private async onComplete(offerCount: number) {
        this.logger.info(`${offerCount} offer create `);
        await this.databaseService.disconnect();
    }

    public async execute(
        fileName: string,
        login: string,
        password: string,
        host: string,
        dbname: string,
        salt: string,
    ): Promise<void> {
        const url = getMongoURL(login, password, host, DEFAULT_DB_PORT, dbname);
        this.salt = salt;

        await this.databaseService.connect(url);
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
