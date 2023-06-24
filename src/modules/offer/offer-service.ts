import { types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../app/logger/loger.interfase';
import { AppComponent } from '../../enum/app-component.enum.js';
import OfferDTO from './create-offer.dto';
import { OfferServiceInterface } from './offer-service.interface';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class OfferService implements OfferServiceInterface {
    constructor(
        @inject(AppComponent.LoggerInterface) private logger: LoggerInterface,
        @inject(AppComponent.OfferModel)
        private offerModel: types.ModelType<OfferEntity>,
    ) {}

    public async create(data: OfferDTO) {
        const freshOffer = await this.offerModel.create(data);
        this.logger.info(`new offer create ${freshOffer.offerName}`);
        return freshOffer;
    }

    public async findById(id: string): Promise<OfferEntity | null> {
        return this.offerModel.findById(id).exec();
    }
}
