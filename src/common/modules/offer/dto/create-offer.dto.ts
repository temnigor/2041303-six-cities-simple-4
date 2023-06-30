import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsObject,
    Matches,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { AmenityEnum } from '../../../../enum/amenity.enum.js';
import { HouseType } from '../../../../enum/house-type.enum.js';
import { Town } from '../../../../enum/town.enum.js';
import { CoordinatesDto } from '../../../../types/coordinates.type.dto.js';

export class CreateOfferDTO {
    @MaxLength(100, { message: 'Max Length offer name 100' })
    @MinLength(10, { message: 'Min Length offer name 10' })
    public offerName!: string;

    @MaxLength(1024, { message: 'Max Length offer description 1024' })
    @MinLength(20, { message: 'Min Length offer description 20' })
    public description!: string;

    @IsDateString({}, { message: 'postDate must be valid ISO date' })
    public date!: Date;

    @IsEnum(Town, { message: 'One of 6 town' })
    public town!: Town;

    @MaxLength(256, { message: 'Too short for field «image»' })
    @Matches(/.jpg |.png/, {
        message: 'image must have format .jpg or .png',
    })
    public previewImage!: string;

    @IsArray({ message: 'Field house image must be an array' })
    @ArrayMaxSize(6, { message: 'Max array length 6' })
    @ArrayMinSize(6, { message: 'Min array length 6' })
    @MaxLength(256, { each: true, message: 'Too short for field «image»' })
    @Matches(/.jpg|.png/, {
        each: true,
        message: 'image must have format .jpg or .png',
    })
    public houseImage!: string[];

    @IsBoolean({ message: 'premium mast be boolean' })
    public premium!: boolean;

    @Max(0, { message: 'Max rating 5' })
    @Min(0, { message: 'Min length 1' })
    public rating!: number;

    @IsEnum(HouseType, { message: 'One of house type' })
    public houseType!: HouseType;

    @Max(8, { message: 'Max room length 8' })
    @Min(1, { message: 'Min room length 1' })
    public room!: number;

    @Max(10, { message: 'Max guest length 10' })
    @Min(1, { message: 'Min guest length 1' })
    public guest!: number;

    @Max(100000, { message: 'Max rating 100000' })
    @Min(100, { message: 'Min length 100' })
    public price!: number;

    @IsArray({ message: 'Amenity mast be array' })
    @IsEnum(AmenityEnum, {
        each: true,
        message: 'all amenity must be of AmenityEnum',
    })
    public amenity!: AmenityEnum[];

    public userId!: string;

    @IsObject({ message: 'coordinatesTown is not object' })
    public coordinatesTown!: CoordinatesDto;
}
