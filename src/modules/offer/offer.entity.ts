import typegoose, {
    defaultClasses,
    getModelForClass,
} from '@typegoose/typegoose';
import { HouseType } from '../../enum/house-type.enum.js';
import { Coordinates } from '../../types/coordinates.type';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'offers',
    },
})
export class OfferEntity extends defaultClasses.TimeStamps {
    @prop({
        type: String,
        required: true,
    })
    public offerName!: string;

    @prop({
        required: true,
    })
    public description!: string;

    @prop({
        required: true,
    })
    public date!: Date;

    @prop({
        required: true,
    })
    public town!: string;

    @prop({
        required: true,
    })
    public previewImage!: string;

    @prop({
        required: true,
    })
    public premium!: boolean;

    @prop({
        default: 0,
    })
    public rating!: number;

    @prop({
        default: 0,
    })
    public commentCount!: number;

    @prop({
        required: true,
        type: () => String,
        enum: HouseType,
    })
    public houseType!: HouseType;

    @prop({
        required: true,
    })
    public room!: number;

    @prop({
        required: true,
    })
    public guest!: number;

    @prop({
        required: true,
    })
    public price!: number;

    @prop({
        required: true,
    })
    public amenity!: string[];

    @prop({
        required: true,
    })
    public userId!: string;

    @prop({
        required: true,
    })
    public coordinatesTown!: Coordinates;
}

export const offerModel = getModelForClass(OfferEntity);
