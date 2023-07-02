import { User } from '../../../types/user.type.js';
import typegoose, {
    defaultClasses,
    getModelForClass,
} from '@typegoose/typegoose';
import { createSHA256 } from '../../../helpers/sha.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'user',
    },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({
        required: true,
    })
    public email!: string;

    @prop({ required: false, type: String })
    public avatarPath?: string;

    @prop({
        required: true,
    })
    public name!: string;

    @prop({ required: true, type: Boolean })
    public userType!: boolean;

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

    public verifyPassword(password: string, salt: string) {
        const hashPassword = createSHA256(password, salt);
        return hashPassword === this.password;
    }
}

export const userModel = getModelForClass(UserEntity);
