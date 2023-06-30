import { Expose } from 'class-transformer';

export default class LoginUserRDO {
    @Expose()
    public token!: string;

    @Expose()
    public email!: string;
}
