import { Max, MaxLength, Min, MinLength } from 'class-validator';
import {
    RATING_MAX_COUNT,
    RATING_MIN_COUNT,
} from '../../offer/validate-offer-constant.js';
import {
    COMMENT_DESCRIPTION_MAX,
    COMMENT_DESCRIPTION_MIN,
} from '../validate-comment-constant.js';

export class CreateCommentDTO {
    @MaxLength(COMMENT_DESCRIPTION_MAX, { message: 'Max length comment 1024' })
    @MinLength(COMMENT_DESCRIPTION_MIN, { message: 'Min length comment 5' })
    public description!: string;

    @Max(RATING_MAX_COUNT, { message: 'Max rating 5' })
    @Min(RATING_MIN_COUNT, { message: 'Min rating 1' })
    public rating!: number;

    public userId!: string;
}
