import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsObject,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { AmenityEnum } from '../../../../enum/amenity.enum.js';
import { HouseType } from '../../../../enum/house-type.enum.js';
import { Town } from '../../../../enum/town.enum.js';
import { CoordinatesDto } from '../../../../types/coordinates.type.dto.js';
import {
    OFFER_DESCRIPTION_MAX_LENGTH,
    OFFER_DESCRIPTION_MIN_LENGTH,
    OFFER_GUEST_SIZE_MAX,
    OFFER_GUEST_SIZE_MIN,
    OFFER_HOUSE_IMAGE_SIZE,
    OFFER_IMAGE_LENGTH,
    OFFER_NAME_MAX_LENGTH,
    OFFER_NAME_MIN_LENGTH,
    OFFER_PRISE_SIZE_MAX,
    OFFER_PRISE_SIZE_MIN,
    OFFER_ROOM_SIZE_MAX,
    OFFER_ROOM_SIZE_MIN,
} from '../validate-offer-constant.js';

export class CreateOfferDTO {
    @MaxLength(OFFER_NAME_MAX_LENGTH, { message: 'Max Length offer name 100' })
    @MinLength(OFFER_NAME_MIN_LENGTH, { message: 'Min Length offer name 10' })
    public offerName!: string;

    @MaxLength(OFFER_DESCRIPTION_MAX_LENGTH, {
        message: 'Max Length offer description 1024',
    })
    @MinLength(OFFER_DESCRIPTION_MIN_LENGTH, {
        message: 'Min Length offer description 20',
    })
    public description!: string;

    @IsEnum(Town, { message: 'One of 6 town' })
    public town!: Town;

    @MaxLength(OFFER_IMAGE_LENGTH, { message: 'Too short for field «image»' })
    public previewImage!: string;

    @IsArray({ message: 'Field house image must be an array' })
    @ArrayMaxSize(OFFER_HOUSE_IMAGE_SIZE, { message: 'Max array length 6' })
    @ArrayMinSize(OFFER_HOUSE_IMAGE_SIZE, { message: 'Min array length 6' })
    @MaxLength(OFFER_IMAGE_LENGTH, {
        each: true,
        message: 'Too short for field «image»',
    })
    public houseImage!: string[];

    @IsBoolean({ message: 'premium mast be boolean' })
    public premium!: boolean;

    @IsEnum(HouseType, { message: 'One of house type' })
    public houseType!: HouseType;

    @Max(OFFER_ROOM_SIZE_MAX, { message: 'Max room length 8' })
    @Min(OFFER_ROOM_SIZE_MIN, { message: 'Min room length 1' })
    public room!: number;

    @Max(OFFER_GUEST_SIZE_MAX, { message: 'Max guest length 10' })
    @Min(OFFER_GUEST_SIZE_MIN, { message: 'Min guest length 1' })
    public guest!: number;

    @Max(OFFER_PRISE_SIZE_MAX, { message: 'Max rating 100000' })
    @Min(OFFER_PRISE_SIZE_MIN, { message: 'Min length 100' })
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
