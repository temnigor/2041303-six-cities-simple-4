import {
    IsBoolean,
    IsEmail,
    IsString,
    Length,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    USER_NAME_MAX,
    USER_NAME_MIN,
    USER_PASSWORD_MAX,
    USER_PASSWORD_MIN,
} from '../user.constant.js';

export default class CreateUserDTO {
    @IsEmail({}, { message: 'email must be valid address' })
    public email!: string;

    @IsString({ message: 'is required' })
    @MaxLength(USER_NAME_MAX, { message: 'name length max 15 symbol' })
    @MinLength(USER_NAME_MIN, { message: 'name min length 1' })
    public name!: string;

    @IsBoolean({ message: 'userType is must be boolean' })
    public userType!: boolean;

    @IsString({ message: 'is required' })
    @Length(USER_PASSWORD_MIN, USER_PASSWORD_MAX, {
        message: 'Min length for password is 6, max is 12',
    })
    public password!: string;
}
