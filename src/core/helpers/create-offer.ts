import { HouseType } from '../../enum/house-type.js';
//import { Offer } from '../../types/offer.type';

function getCoordinate(data: string) {
    const coordinate: { [coordinateName: string]: string } = {};
    data.split(',')
        .map(element => element.split(':'))
        .forEach(element => {
            const elem = element[0];
            coordinate[elem] = element[1];
        });
    return coordinate;
}

export function createOffer(offerString: string) {
    const [
        offerName,
        description,
        date,
        town,
        previewImage,
        premium,
        rating,
        houseType,
        room,
        guest,
        price,
        amenity,
        user,
        coordinatesTown,
    ] = offerString.split('\t');

    return {
        offerName,
        description,
        date: new Date(date),
        town,
        previewImage,
        premium: Boolean(Number.parseInt(premium, 10)),
        rating: Number.parseInt(rating, 10),
        houseType:
            HouseType[houseType as 'apartment' | 'house' | 'room' | 'hotel'],
        room: Number.parseInt(room, 10),
        guest: Number.parseInt(guest, 10),
        price: Number.parseInt(price, 10),
        amenity: amenity.split(','),
        user: Number.parseInt(user, 10),
        coordinatesTown: getCoordinate(coordinatesTown),
    };
}
