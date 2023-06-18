import { Container } from 'inversify';
import ConfigService from './app/config/config-service.js';
import { LoggerInterface } from './app/logger/loger.interfase.js';
import { PinoService } from './app/logger/pino.service.js';
import RestApplication from './app/rest-application.js';
import { AppComponent } from './types/app-component.enum.js';

async function bootstrap() {
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

    const rest = container.get<RestApplication>(AppComponent.RestApplication);
    await rest.init();
}

bootstrap();
