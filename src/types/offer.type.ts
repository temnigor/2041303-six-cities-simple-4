import { Coordinates } from './coordinates.type';

export type Offer = {
    offerName: string;
    description: string;
    date: Date;
    town: string;
    previewImage: string;
    premium: boolean;
    rating: number;
    houseType: string;
    room: number;
    guest: number;
    price: number;
    amenity: string[];
    user: {
        name: string;
        email: string;
        avatarPath: string;
        userType: boolean;
    };
    coordinatesTown: Coordinates;
};
