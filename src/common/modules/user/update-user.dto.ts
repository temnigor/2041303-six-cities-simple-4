import {
    IsMongoId,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export default class UpdateUserDTO {
    @IsMongoId({ message: 'id for mongo' })
    public id!: string;

    @IsOptional()
    @IsString({ message: 'is required' })
    @MaxLength(15, { message: 'name length max 15 symbol' })
    @MinLength(1, { message: 'name min length 1' })
    public name?: string;

    @IsOptional()
    @MaxLength(256, { each: true, message: 'Too short for field «image»' })
    @Matches(/.jpg|.png/, {
        each: true,
        message: 'image must have format .jpg or .png',
    })
    public avatarPath?: string;
}
