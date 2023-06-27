import { Container } from 'inversify';
import RestApplication from './app/rest-application.js';
import { AppComponent } from './enum/app-component.enum.js';
import { createCommentContainer } from './common/modules/comment/comment.contanier.js';
import { createOfferServiceContainer } from './common/modules/offer/offer-service.container.js';
import { createUserServiceContainer } from './common/modules/user/user.service.container.js';
import { createRestApplicationContainer } from './app/rest.container.js';

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
