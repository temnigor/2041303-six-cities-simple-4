import { AmenityEnum } from '../enum/amenity.enum';
import { Coordinates } from './coordinates.type';
import { PremiumType } from './premium.type';

export type Offer = {
    offerName: string;
    description: string;
    date: Date;
    town: string;
    previewImage: string;
    premium: PremiumType;
    rating: number;
    houseType: string;
    room: number;
    guest: number;
    price: number;
    amenity: AmenityEnum;
    user: number;
    coordinatesTown: Coordinates;
};
