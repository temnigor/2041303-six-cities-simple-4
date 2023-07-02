import { IsEmail, IsString, Length } from 'class-validator';
import { USER_PASSWORD_MAX, USER_PASSWORD_MIN } from '../user.constant';

export class LoginUserDto {
    @IsEmail({}, { message: 'email must be valid address' })
    public email!: string;

    @IsString({ message: 'is required' })
    @Length(USER_PASSWORD_MIN, USER_PASSWORD_MAX, {
        message: 'Min length for password is 6, max is 12',
    })
    public password!: string;
}
