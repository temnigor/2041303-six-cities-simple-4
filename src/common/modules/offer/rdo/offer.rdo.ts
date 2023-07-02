import { Expose, Type } from 'class-transformer';
import { Coordinates } from '../../../../types/coordinates.type.js';
import UserRDO from '../../user/rdo/user.rdo.js';

export class OfferRDO {
    @Expose()
    id!: string;

    @Expose()
    public offerName!: string;

    @Expose()
    public description!: string;

    @Expose()
    public updatedAt!: string;

    @Expose()
    public town!: string;

    @Expose()
    public previewImage!: string;

    @Expose()
    public houseImage!: string[];

    @Expose()
    public premium!: boolean;

    @Expose()
    public rating!: number;

    @Expose()
    public houseType!: string;

    @Expose()
    public room!: number;

    @Expose()
    public guest!: number;

    @Expose()
    public price!: number;

    @Expose()
    public amenity!: string[];

    @Expose()
    public coordinatesTown!: Coordinates;

    @Expose({ name: 'userId' })
    @Type(() => UserRDO)
    public user!: UserRDO;
}
