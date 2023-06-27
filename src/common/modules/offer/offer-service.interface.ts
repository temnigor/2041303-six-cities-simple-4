import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity';
import { UpdateOfferDto } from './dto/update-offer.dto';

export interface OfferServiceInterface {
    create(data: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
    findById(id: string): Promise<DocumentType<OfferEntity> | null>;
    find(limit: number): Promise<DocumentType<OfferEntity>[]>;
    deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    updateById(
        offerId: string,
        dto: UpdateOfferDto,
    ): Promise<DocumentType<OfferEntity> | null>;
    incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    findNew(count: number): Promise<DocumentType<OfferEntity>[]>;
    findDiscussed(count: number): Promise<DocumentType<OfferEntity>[]>;
    exists(documentId: string): Promise<boolean>;
}
