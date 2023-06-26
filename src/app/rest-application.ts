import { inject, injectable } from 'inversify';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import { getMongoURL } from '../core/helpers/db-url.js';
import { AppComponent } from '../enum/app-component.enum.js';
import { ConfigInterface } from './config/config.interface.js';
import { ConfigSchema } from './config/config.schema.js';
import { LoggerInterface } from './logger/loger.interface.js';

@injectable()
export default class RestApplication {
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
        @inject(AppComponent.ConfigInterface)
        private readonly config: ConfigInterface<ConfigSchema>,
        @inject(AppComponent.DatabaseInterface)
        private readonly databaseClient: DatabaseClientInterface,
    ) {}

    private _initDb() {
        const mongoUrl = getMongoURL(
            this.config.get('DB_USER') as string,
            this.config.get('DB_PASSWORD') as string,
            this.config.get('DB_HOST') as string,
            this.config.get('DB_PORT') as string,
            this.config.get('DB_NAME') as string,
        );
        return this.databaseClient.connect(mongoUrl);
    }

    public async init() {
        this.logger.info('Application initialization...');
        this.logger.info(
            `Get value from env $PORT: ${this.config.get('PORT')}`,
        );

        this.logger.info('Init database…');
        await this._initDb();
        this.logger.info('Init database completed');
    }
}
