import { Coordinates } from '../../types/coordinates.type';

export default class OfferDTO {
    public offerName!: string;
    public description!: string;
    public date!: Date;
    public town!: string;
    public previewImage!: string;
    public premium!: boolean;
    public rating!: number;
    public houseType!: string;
    public room!: number;
    public guest!: number;
    public price!: number;
    public amenity!: string[];
    public userId!: string;
    public coordinatesTown!: Coordinates;
}
