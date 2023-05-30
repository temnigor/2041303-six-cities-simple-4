import {
    getRandomItem,
    getRandomItems,
} from '../../core/helpers/randomizer.js';
import { MockData } from '../../types/mock-data.type';
import { OfferGeneratorInterface } from './offer-generator.interface';

export class OfferGenerator implements OfferGeneratorInterface {
    constructor(private readonly mockData: MockData) {}

    public generate(): string {
        console.log(this.mockData);
        const offerName = getRandomItem(this.mockData.offerName);
        const description = getRandomItem(this.mockData.description);
        const date = getRandomItem(this.mockData.date);
        const town = getRandomItem(this.mockData.town);
        const previewImage = getRandomItem(this.mockData.previewImage);
        const premium = getRandomItem(this.mockData.premium);
        const rating = getRandomItem(this.mockData.rating);
        const houseType = getRandomItem(this.mockData.houseType);
        const room = getRandomItem(this.mockData.room);
        const guest = getRandomItem(this.mockData.guest);
        const price = getRandomItem(this.mockData.price);
        const amenity = getRandomItems(this.mockData.amenity);
        const user = getRandomItem(this.mockData.user);
        const coordinatesTown = getRandomItem(this.mockData.coordinatesTown);

        return [
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
        ].join('\t');
    }
}
