import { inject, injectable } from 'inversify';
import { AppComponent } from '../enum/app-component.enum.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import express, { Express } from 'express';
import { ConfigInterface } from '../common/config/config.interface.js';
import { ConfigSchema } from '../common/config/config.schema.js';
import { DatabaseClientInterface } from '../common/database-client/database-client.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../common/controller/exceptions-filter/exception-filter.interface.js';
import { getMongoURL } from '../helpers/db-url.js';

@injectable()
export default class RestApplication {
    private expressApplication: Express;
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
        @inject(AppComponent.ConfigInterface)
        private readonly config: ConfigInterface<ConfigSchema>,
        @inject(AppComponent.DatabaseInterface)
        private readonly databaseClient: DatabaseClientInterface,
        @inject(AppComponent.CommentController)
        private readonly commentController: ControllerInterface,
        @inject(AppComponent.ExceptionFilter)
        private exceptionFilter: ExceptionFilterInterface,
        @inject(AppComponent.UserController)
        private userController: ControllerInterface,
        @inject(AppComponent.OfferController)
        private offerController: ControllerInterface,
    ) {
        this.expressApplication = express();
    }

    private async _initDb() {
        this.logger.info('init Database...');
        const mongoUrl = getMongoURL(
            this.config.get('DB_USER') as string,
            this.config.get('DB_PASSWORD') as string,
            this.config.get('DB_HOST') as string,
            this.config.get('DB_PORT') as string,
            this.config.get('DB_NAME') as string,
        );
        await this.databaseClient.connect(mongoUrl);
        this.logger.info('init Database compleat');
    }

    private async _initServer() {
        this.logger.info('Try to init server…');
        const port = this.config.get('PORT');
        this.expressApplication.listen(port);
        this.logger.info(
            `🚀Server started on http://localhost:${this.config.get('PORT')}`,
        );
    }

    private _initRouts() {
        this.logger.info('Try init user routs');
        this.expressApplication.use('/user', this.userController.router);
        this.logger.info('user routs init');
        this.logger.info('Try init offer routs');
        this.expressApplication.use(this.offerController.router);
        this.logger.info('offer routs init');
        this.logger.info('Try init comment routs');
        this.expressApplication.use('/comment', this.commentController.router);
        this.logger.info('comment routs init');
    }

    private async _initMiddleware() {
        this.logger.info('Global middleware initialization…');
        this.expressApplication.use(express.json());
        this.logger.info('Global middleware initialization completed');
    }

    private async _initExceptionFilter() {
        this.logger.info('Try init exception filter');
        this.expressApplication.use(
            this.exceptionFilter.catch.bind(this.exceptionFilter),
        );
        this.logger.info('exception filter completed');
    }

    public async init() {
        this.logger.info('Application initialization...');
        await this._initDb();
        await this._initRouts();
        await this._initMiddleware();
        await this._initExceptionFilter;
        await this._initServer();
    }
}
