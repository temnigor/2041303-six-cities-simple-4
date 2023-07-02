import { AmenityEnum } from '../enum/amenity.enum';
import { HouseType } from '../enum/house-type.enum';
import { Town } from '../enum/town.enum';
import { Coordinates } from './coordinates.type';

export type Offer = {
    offerName: string;
    description: string;
    town: Town;
    previewImage: string;
    houseImage: string[];
    premium: boolean;
    houseType: HouseType;
    room: number;
    guest: number;
    price: number;
    amenity: AmenityEnum[];
    user: {
        name: string;
        email: string;
        userType: boolean;
    };
    coordinatesTown: Coordinates;
};
