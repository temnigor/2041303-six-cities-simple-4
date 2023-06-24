import OfferDTO from './create-offer.dto';
import { OfferEntity } from './offer.entity';

export interface OfferServiceInterface {
    create(data: OfferDTO): Promise<OfferEntity>;
    findById(id: string): Promise<OfferEntity | null>;
}
