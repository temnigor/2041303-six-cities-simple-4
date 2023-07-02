import cors from 'cors';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../enum/app-component.enum.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import express, { Express } from 'express';
import { ConfigInterface } from '../common/config/config.interface.js';
import { ConfigSchema } from '../common/config/config.schema.js';
import { DatabaseClientInterface } from '../common/database-client/database-client.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../common/exceptions-filter/exception-filter.interface.js';
import { getMongoURL } from '../helpers/db-url.js';
import { AuthenticateMiddleware } from '../common/middleware/authenticate.middleware.js';
import { getFullServerPath } from '../helpers/server-path.js';

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
        @inject(AppComponent.HttpErrorExceptionFilter)
        private readonly httpErrorExceptionFilter: ExceptionFilterInterface,
        @inject(AppComponent.UserController)
        private userController: ControllerInterface,
        @inject(AppComponent.OfferController)
        private offerController: ControllerInterface,
        @inject(AppComponent.BaseExceptionFilter)
        private readonly baseExceptionFilter: ExceptionFilterInterface,
        @inject(AppComponent.ValidationExceptionFilter)
        private readonly validationExceptionFilter: ExceptionFilterInterface,
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
            `🚀Server started on ${getFullServerPath(
                this.config.get('HOST') as string,
                this.config.get('PORT') as number,
            )}`,
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
        this.expressApplication.use(
            '/static',
            express.static(this.config.get('STATIC_DIRECTORY_PATH') as string),
        );
    }

    private async _initMiddleware() {
        this.logger.info('Global middleware initialization…');
        this.expressApplication.use(express.json());
        this.expressApplication.use(
            'upload/',
            express.static(this.config.get('UPLOAD_DIRECTORY') as string),
        );
        const authenticateMiddleware = new AuthenticateMiddleware(
            this.config.get('JWT_SECRET') as string,
        );
        this.expressApplication.use(
            authenticateMiddleware.execute.bind(authenticateMiddleware),
        );
        this.expressApplication.use(cors());

        this.logger.info('Global middleware initialization completed');
    }

    private async _initExceptionFilter() {
        this.logger.info('Try init exceptions filter');
        this.expressApplication.use(
            this.validationExceptionFilter.catch.bind(
                this.validationExceptionFilter,
            ),
        );
        this.expressApplication.use(
            this.httpErrorExceptionFilter.catch.bind(
                this.httpErrorExceptionFilter,
            ),
        );
        this.expressApplication.use(
            this.baseExceptionFilter.catch.bind(this.baseExceptionFilter),
        );
        this.logger.info('exception filters completed');
    }

    public async init() {
        this.logger.info('Application initialization...');
        await this._initDb();
        await this._initMiddleware();
        await this._initRouts();
        await this._initExceptionFilter();
        await this._initServer();
    }
}
