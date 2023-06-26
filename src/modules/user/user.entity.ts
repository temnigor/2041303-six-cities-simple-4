import { User } from '../../types/user.type.js';
import typegoose, {
    defaultClasses,
    getModelForClass,
} from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/common.js';

const { prop, modelOptions } = typegoose;
const DEFAULT_AVATAR = 'avatar-max.jpg';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'user',
    },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({
        unique: true,
        required: true,
        match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
        default: '',
    })
    public email: string;

    @prop({ type: String, default: DEFAULT_AVATAR })
    public avatarPath: string;

    @prop({
        required: true,
        maxlength: [15, 'max length 15'],
        minlength: [1, 'min length 1'],
    })
    public name: string;

    @prop({ type: Boolean })
    public userType: boolean;

    @prop({ required: true })
    private password?: string;

    constructor(userData: User) {
        super();
        this.email = userData.email;
        this.name = userData.name;
        this.avatarPath = userData.avatarPath;
        this.userType = userData.userType;
    }

    public setPassword(password: string, salt: string) {
        this.password = createSHA256(password, salt);
    }

    public getPassword() {
        return this.password;
    }
}

export const userModel = getModelForClass(UserEntity);
