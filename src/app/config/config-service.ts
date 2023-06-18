import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum';
import { LoggerInterface } from '../logger/loger.interfase';
import { ConfigInterface } from './config.interface';
import { ConfigSchema, ConfigSchemaEnv } from './config.schema';

@injectable()
export default class ConfigService implements ConfigInterface<ConfigSchema> {
    private readonly config: ConfigSchema;

    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
    ) {
        const parsedOutput = config();

        if (parsedOutput.error) {
            throw new Error('not found .env file.');
        }

        ConfigSchemaEnv.load({});
        ConfigSchemaEnv.validate({
            allowed: 'strict',
            output: this.logger.info,
        });
        this.config = ConfigSchemaEnv.getProperties();
        this.logger.info('.env file parsed');
    }

    public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
        return this.config[key];
    }
}
