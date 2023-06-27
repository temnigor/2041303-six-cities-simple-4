import { IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCommentDTO {
    @IsMongoId({ message: 'offerId mast valid as id' })
    public offerId!: string;

    @MaxLength(1024, { message: 'Max length comment 1024' })
    @MinLength(5, { message: 'Min length comment 5' })
    public description!: string;

    @Max(5, { message: 'Max rating 5' })
    @Min(1, { message: 'Min rating 1' })
    public rating!: number;

    @IsMongoId({ message: 'userId field must be valid an id' })
    public userId!: string;
}
