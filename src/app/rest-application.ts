import { inject } from 'inversify';
import { AppComponent } from '../types/app-component.enum.js';
import { ConfigInterface } from './config/config.interface.js';
import { ConfigSchema } from './config/config.schema.js';
import { LoggerInterface } from './logger/loger.interfase.js';

export default class RestApplication {
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
        @inject(AppComponent.ConfigInterface)
        private readonly config: ConfigInterface<ConfigSchema>,
    ) {}

    public init() {
        this.logger.info('Application initialization...');
        this.logger.info(
            `Get value from env $PORT: ${this.config.get('PORT')}`,
        );
    }
}
