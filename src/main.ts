import { Container } from 'inversify';
import RestApplication from './app/rest-application.js';
import { AppComponent } from './enum/app-component.enum.js';
import { createCommentContainer } from './modules/comment/comment.contanier.js';
import { createOfferServiceContainer } from './modules/offer/offer-service.container.js';
import { createUserServiceContainer } from './modules/user/user.service.container.js';
import { createRestApplicationContainer } from './rest.container.js';

async function bootstrap() {
    const mainContainer = Container.merge(
        createRestApplicationContainer(),
        createUserServiceContainer(),
        createOfferServiceContainer(),
        createCommentContainer(),
    );

    const rest = mainContainer.get<RestApplication>(
        AppComponent.RestApplication,
    );
    await rest.init();
}

bootstrap();
