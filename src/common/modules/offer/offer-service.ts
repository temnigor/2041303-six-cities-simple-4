import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { SortType } from '../../../enum/sort-type.enum.js';
import { CreateOfferDTO } from './dto/create-offer.dto';

import { OfferServiceInterface } from './offer-service.interface';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { UpdateOfferRatingDto } from './dto/update-offer.rating.dto';

@injectable()
export class OfferService implements OfferServiceInterface {
    constructor(
        @inject(AppComponent.LoggerInterface) private logger: LoggerInterface,
        @inject(AppComponent.OfferModel)
        private offerModel: types.ModelType<OfferEntity>,
    ) {}

    public async create(data: CreateOfferDTO) {
        const freshOffer = await this.offerModel.create(data);
        this.logger.info(`new offer create ${freshOffer.offerName}`);
        return freshOffer;
    }

    public async findById(
        id: string,
    ): Promise<DocumentType<OfferEntity> | null> {
        return this.offerModel.findById(id).populate(['userId']).exec();
    }

    public async deleteById(
        offerId: string,
    ): Promise<DocumentType<OfferEntity> | null> {
        return this.offerModel.findByIdAndDelete(offerId).exec();
    }

    public async updateById(
        offerId: string,
        dto: UpdateOfferDto,
    ): Promise<DocumentType<OfferEntity, types.BeAnObject> | null> {
        return this.offerModel
            .findByIdAndUpdate(offerId, dto, { new: true })
            .exec();
    }

    public async exists(documentId: string): Promise<boolean> {
        return (await this.offerModel.exists({ _id: documentId })) !== null;
    }

    public async incCommentCount(
        offerId: string,
    ): Promise<DocumentType<OfferEntity> | null> {
        return this.offerModel
            .findByIdAndUpdate(offerId, {
                $inc: {
                    commentCount: 1,
                },
            })
            .exec();
    }

    public async updateRatingById(
        offerId: string,
        dto: UpdateOfferRatingDto,
    ): Promise<void> {
        await this.offerModel
            .findByIdAndUpdate(offerId, dto, { new: true })
            .exec();
        this.logger.info('rating update');
    }

    public async find(limit: number): Promise<DocumentType<OfferEntity>[]> {
        return this.offerModel
            .find()
            .sort({ createdAt: SortType.Down })
            .populate(['userId'])
            .limit(limit);
    }
}
