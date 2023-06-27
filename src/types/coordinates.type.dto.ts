import { IsLatitude, IsLongitude } from 'class-validator';

export class CoordinatesDto {
    @IsLatitude({ message: 'not correct Latitude' })
    public latitude!: number;

    @IsLongitude({ message: 'not corect Longitude' })
    public longitude!: number;
}
