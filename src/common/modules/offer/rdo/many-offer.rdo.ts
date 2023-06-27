import { Expose } from 'class-transformer';

export class ManyOfferRDO {
    @Expose()
    public id!: string;

    @Expose()
    public offerName!: string;

    @Expose()
    public updatedAt!: string;

    @Expose()
    public town!: string;

    @Expose()
    public previewImage!: string;

    @Expose()
    public premium!: boolean;

    @Expose()
    public rating!: number;

    @Expose()
    public houseType!: string;

    @Expose()
    public price!: number;

    @Expose()
    commentCount!: number;
}
