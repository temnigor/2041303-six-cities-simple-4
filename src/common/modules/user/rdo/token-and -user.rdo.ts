import { Expose } from 'class-transformer';

export default class TokenAndUserRDO {
    @Expose()
    public token!: string;

    @Expose()
    public email!: string;

    @Expose()
    public avatarPath!: string;

    @Expose()
    public userType!: string;

    @Expose()
    public name!: string;
}
