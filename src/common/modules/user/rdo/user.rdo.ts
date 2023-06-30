import { Expose } from 'class-transformer';

export default class UserRDO {
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
