import { Expose } from 'class-transformer';

export default class LoginUserRDO {
    @Expose()
    public token!: string;

    @Expose()
    public id!: string;

    @Expose()
    public email!: string;

    @Expose()
    public name!: string;

    @Expose()
    public avatarPath!: string;

    @Expose()
    public userType!: boolean;
}
