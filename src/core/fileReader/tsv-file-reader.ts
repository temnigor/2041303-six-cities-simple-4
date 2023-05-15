import { readFileSync } from 'fs';
import { FileReaderInterface } from './interface/file-reader.interface.js';
import { PremiumType } from '../../types/premium.type.js';

export default class TSVFileReader implements FileReaderInterface {
    constructor(public fileName: string) {}

    private rawData = '';

    read(): void {
        this.rawData = readFileSync(this.fileName, { encoding: 'utf-8' });
    }

    public toArray() {
        this.read();
        return this.rawData
            .split('\n')
            .filter(row => row.trim() !== '')
            .map(line => line.split('\t'))
            .map(
                ([
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
                ]) => ({
                    offerName,
                    description,
                    date: new Date(date),
                    town,
                    previewImage,
                    premium: PremiumType[premium as 'true' | 'false'],
                    rating: Number.parseInt(rating, 10),
                    houseType,
                    room: Number.parseInt(room, 10),
                    guest: Number.parseInt(guest, 10),
                    price: Number.parseInt(price, 10),
                    amenity: amenity.split(','),
                    user: Number.parseInt(user, 10),
                    coordinatesTown: this.getCoordinate(coordinatesTown),
                }),
            );
    }

    private getCoordinate(data: string) {
        const coordinate: { [cordinateName: string]: string } = {};
        data.split(',')
            .map(element => element.split(':'))
            .forEach(element => {
                const elem = element[0];
                coordinate[elem] = element[1];
            });
        return coordinate;
    }
}
