import { Length } from 'class-validator';
import {
    RATING_MAX_COUNT,
    RATING_MIN_COUNT,
} from '../validate-offer-constant.js';

export class UpdateOfferRatingDto {
    @Length(RATING_MIN_COUNT, RATING_MAX_COUNT, { message: 'rating not valid' })
    rating!: number;
}
