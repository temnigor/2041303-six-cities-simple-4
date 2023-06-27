import { CliCommandInterface } from '../interface/cli-command-interface.js';
import { createOffer } from '../../helpers/create-offer.js';
import { getMongoURL } from '../../helpers/db-url.js';
import { UserServiceInterface } from '../../common/modules/user/user.service.interface.js';
import { OfferServiceInterface } from '../../common/modules/offer/offer-service.interface.js';
import { DatabaseClientInterface } from '../../common/database-client/database-client.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console.service..js';
import { UserService } from '../../common/modules/user/user.service.js';
import { OfferService } from '../../common/modules/offer/offer-service.js';
import { MongoService } from '../../common/database-client/mongo-service.js';
import { userModel } from '../../common/modules/user/user.entity.js';
import { offerModel } from '../../common/modules/offer/offer.entity.js';
import { Offer } from '../../types/offer.type.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';

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
        if (!(await this.userService.exist(offer.user.email))) {
            const user = await this.userService.create(
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
                houseImage: offer.houseImage,
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
        this.logger.info(`this user email:${offer.user.email} exist`);
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
