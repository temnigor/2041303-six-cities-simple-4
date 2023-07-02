import { Container } from 'inversify';
import ConfigService from '../common/config/config-service.js';
import BaseExceptionFilter from '../common/exceptions-filter/base-exception-filter.js';
import { ExceptionFilterInterface } from '../common/exceptions-filter/exception-filter.interface.js';
import HttpErrorExceptionFilter from '../common/exceptions-filter/http-error-exception-filter.js';
import ValidationExceptionFilter from '../common/exceptions-filter/validate-exception-filter.js';
import { DatabaseClientInterface } from '../common/database-client/database-client.interface.js';
import { MongoService } from '../common/database-client/mongo-service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { PinoService } from '../common/logger/pino.service.js';
import { AppComponent } from '../enum/app-component.enum.js';
import RestApplication from './rest-application.js';

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
        .inSingletonScope();
    container
        .bind<ExceptionFilterInterface>(AppComponent.HttpErrorExceptionFilter)
        .to(HttpErrorExceptionFilter)
        .inSingletonScope();
    container
        .bind<ExceptionFilterInterface>(AppComponent.ValidationExceptionFilter)
        .to(ValidationExceptionFilter)
        .inSingletonScope();
    container
        .bind<ExceptionFilterInterface>(AppComponent.BaseExceptionFilter)
        .to(BaseExceptionFilter)
        .inSingletonScope();

    return container;
}
