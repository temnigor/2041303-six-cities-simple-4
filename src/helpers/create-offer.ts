import { HouseType } from '../../enum/house-type.enum.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { Offer } from '../../types/offer.type';

function getCoordinate(data: string): Coordinates {
    const coordinate: { [coordinateName: string]: number } = {};
    data.split(',')
        .map(element => element.split(':'))
        .forEach(element => {
            const elem = element[0];
            coordinate[elem] = parseInt(element[1], 10);
        });
    return coordinate as Coordinates;
}

export function createOffer(offerString: string): Offer {
    const [
        offerName,
        description,
        date,
        town,
        previewImage,
        houseImage,
        premium,
        rating,
        houseType,
        room,
        guest,
        price,
        amenity,
        name,
        email,
        avatarPath,
        userType,
        coordinatesTown,
    ] = offerString.split('\t');

    return {
        offerName,
        description,
        date: new Date(date),
        town,
        previewImage,
        houseImage: houseImage.split(','),
        premium: Boolean(Number.parseInt(premium, 10)),
        rating: Number.parseInt(rating, 10),
        houseType:
            HouseType[houseType as 'apartment' | 'house' | 'room' | 'hotel'],
        room: Number.parseInt(room, 10),
        guest: Number.parseInt(guest, 10),
        price: Number.parseInt(price, 10),
        amenity: amenity.split(','),
        user: {
            name,
            email,
            avatarPath,
            userType: Boolean(Number.parseInt(userType, 10)),
        },

        coordinatesTown: getCoordinate(coordinatesTown),
    };
}
