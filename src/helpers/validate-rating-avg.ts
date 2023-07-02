import {
    DEFAULT_RATING,
    RATING_MAX_COUNT,
    RATING_MIN_COUNT,
} from '../common/modules/offer/validate-offer-constant.js';

export function validateRatingAvg(rating: number | undefined): number {
    const ratingAvg = Number(rating);
    if (ratingAvg >= RATING_MIN_COUNT && ratingAvg <= RATING_MAX_COUNT) {
        return Number(ratingAvg.toFixed(1));
    }
    if (ratingAvg < RATING_MIN_COUNT) {
        return RATING_MIN_COUNT;
    }

    if (ratingAvg > RATING_MAX_COUNT) {
        return RATING_MAX_COUNT;
    }

    return DEFAULT_RATING;
}
