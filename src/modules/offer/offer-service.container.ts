import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum.js';
import { OfferService } from './offer-service.js';
import { OfferServiceInterface } from './offer-service.interface';
import { OfferEntity, offerModel } from './offer.entity.js';

export function createOfferServiceContainer() {
    const container = new Container();
    container
        .bind<OfferServiceInterface>(AppComponent.OfferServiceInterface)
        .to(OfferService)
        .inSingletonScope();
    container
        .bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel)
        .toConstantValue(offerModel);

    return container;
}
