import typegoose, {
    defaultClasses,
    getModelForClass,
    Ref,
} from '@typegoose/typegoose';
import { HouseType } from '../../../enum/house-type.enum.js';
import { Coordinates } from '../../../types/coordinates.type';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

const HOUSE_IMAGE_COUNT = 6;

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
    public town!: string;

    @prop({
        required: true,
        default: '',
    })
    public previewImage!: string;

    @prop({
        type: Array,
        required: true,
        validate: {
            validator: (v: string[]) => v.length === HOUSE_IMAGE_COUNT,
            message: 'need 6 house image',
        },
    })
    public houseImage!: string[];

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
        ref: UserEntity,
        required: true,
    })
    public userId!: Ref<UserEntity>;

    @prop({
        required: true,
    })
    public coordinatesTown!: Coordinates;
}

export const offerModel = getModelForClass(OfferEntity);
