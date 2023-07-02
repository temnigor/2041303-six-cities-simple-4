export function validateRatingAvg(rating: number | undefined): number {
    const ratingAvg = Number(rating);
    if (ratingAvg >= 1 && ratingAvg <= 5) {
        return Number(ratingAvg.toFixed(1));
    }
    if (ratingAvg < 1) {
        return 1;
    }

    if (ratingAvg > 5) {
        return 5;
    }

    return 0;
}
