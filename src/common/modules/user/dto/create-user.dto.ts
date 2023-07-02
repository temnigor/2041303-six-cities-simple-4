import {
    IsBoolean,
    IsEmail,
    IsString,
    Length,
    MaxLength,
    MinLength,
} from 'class-validator';

export default class CreateUserDTO {
    @IsEmail({}, { message: 'email must be valid address' })
    public email!: string;

    @IsString({ message: 'is required' })
    @MaxLength(15, { message: 'name length max 15 symbol' })
    @MinLength(1, { message: 'name min length 1' })
    public name!: string;

    @IsBoolean({ message: 'userType is must be boolean' })
    public userType!: boolean;

    @IsString({ message: 'is required' })
    @Length(5, 12, { message: 'Min length for password is 6, max is 12' })
    public password!: string;
}
