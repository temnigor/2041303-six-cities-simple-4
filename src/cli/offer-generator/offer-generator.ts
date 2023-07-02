import { getRandomItem, getRandomItems } from '../../helpers/randomizer.js';
import { MockData } from '../../types/mock-data.type';
import { GeneratorInterface } from './generator.interface';

let EMAIL_COUNT = 1;
export class OfferGenerator implements GeneratorInterface {
    public generate(mockData: MockData): string {
        const offerName = getRandomItem(mockData.offerName);
        const description = getRandomItem(mockData.description);
        const town = getRandomItem(mockData.town);
        const previewImage = getRandomItem(mockData.previewImage);
        const houseImage = mockData.previewImage;
        const premium = getRandomItem(mockData.premium);
        const houseType = getRandomItem(mockData.houseType);
        const room = getRandomItem(mockData.room);
        const guest = getRandomItem(mockData.guest);
        const price = getRandomItem(mockData.price);
        const amenity = getRandomItems(mockData.amenity);
        const name = getRandomItem(mockData.user.name);
        const email = `${EMAIL_COUNT++}${getRandomItem(mockData.user.email)}`;
        const userType = getRandomItem(mockData.user.userType);
        const coordinatesTown = getRandomItem(mockData.coordinatesTown);

        return [
            offerName,
            description,
            town,
            previewImage,
            houseImage,
            premium,
            houseType,
            room,
            guest,
            price,
            amenity,
            name,
            email,
            userType,
            coordinatesTown,
        ].join('\t');
    }
}
