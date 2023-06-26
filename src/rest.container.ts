import { Container } from 'inversify';
import ConfigService from './app/config/config-service.js';
import { LoggerInterface } from './app/logger/loger.interface.js';
import { PinoService } from './app/logger/pino.service.js';
import { MongoService } from './core/database-client/mongo-service.js';
import { DatabaseClientInterface } from './core/database-client/database-client.interface.js';
import { AppComponent } from './enum/app-component.enum.js';
import RestApplication from './app/rest-application.js';

export function createRestApplicationContainer() {
    const container = new Container();
    container
        .bind<RestApplication>(AppComponent.RestApplication)
        .to(RestApplication)
        .inSingletonScope();
    container
        .bind<ConfigService>(AppComponent.ConfigInterface)
        .to(ConfigService)
        .inSingletonScope();
    container
        .bind<LoggerInterface>(AppComponent.LoggerInterface)
        .to(PinoService)
        .inSingletonScope();
    container
        .bind<DatabaseClientInterface>(AppComponent.DatabaseInterface)
        .to(MongoService)
        .inRequestScope();

    return container;
}
