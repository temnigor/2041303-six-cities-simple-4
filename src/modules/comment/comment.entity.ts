import typegoose, {
    defaultClasses,
    getModelForClass,
} from '@typegoose/typegoose';

const { prop, ModelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@ModelOptions({
    schemaOptions: {
        collection: 'comment',
    },
})
export class CommentEntity extends defaultClasses.TimeStamps {
    @prop({ require: true })
    public description!: string;

    @prop({ required: true })
    public rating!: number;

    @prop({ required: true })
    public userId!: string;
}

export const commentModel = getModelForClass(CommentEntity);
