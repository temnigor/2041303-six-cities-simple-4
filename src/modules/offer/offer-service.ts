import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../app/logger/loger.interface';
import { AppComponent } from '../../enum/app-component.enum.js';
import { SortType } from '../../enum/sort-type.enum.js';
import CreateOfferDTO from './create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './update-offer.dto.js';

const DEFAULT_OFFERS_COUNT_LIMIT = 60;

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
        return this.offerModel.findById(id).populate('userId').exec();
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

    public async find(
        limit = DEFAULT_OFFERS_COUNT_LIMIT,
    ): Promise<DocumentType<OfferEntity>[]> {
        return this.offerModel
            .aggregate([
                {
                    $lookup: {
                        from: 'comment',
                        let: { offerId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$$offerId', '$offers'],
                                    },
                                },
                            },
                            { $project: { _id: 1 } },
                        ],
                        as: 'comment',
                    },
                },
                {
                    $addFields: {
                        id: { $toString: '$_id' },
                        commentCount: { $size: '$comment' },
                    },
                },
                { $unset: 'comment' },
                { $limit: limit },
                { $sort: { offerCount: SortType.Down } },
            ])

            .exec();
    }

    public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
        return this.offerModel
            .find()
            .sort({ createdAt: SortType.Down })
            .limit(count)
            .populate(['userId'])
            .exec();
    }

    public async findDiscussed(
        count: number,
    ): Promise<DocumentType<OfferEntity>[]> {
        return this.offerModel
            .find()
            .sort({ commentCount: SortType.Down })
            .limit(count)
            .populate(['userId'])
            .exec();
    }
}
