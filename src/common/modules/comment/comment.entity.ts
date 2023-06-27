import typegoose, {
    defaultClasses,
    getModelForClass,
    Ref,
} from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, ModelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@ModelOptions({
    schemaOptions: {
        collection: 'comment',
    },
})
export class CommentEntity extends defaultClasses.TimeStamps {
    @prop({ required: true, ref: OfferEntity })
    public offerId!: Ref<OfferEntity>;

    @prop({ require: true })
    public description!: string;

    @prop({ required: true })
    public rating!: number;

    @prop({ required: true, ref: UserEntity })
    public userId!: Ref<UserEntity>;
}

export const commentModel = getModelForClass(CommentEntity);
