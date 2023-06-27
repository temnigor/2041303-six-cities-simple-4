import {
    IsBoolean,
    IsEmail,
    IsString,
    Length,
    Matches,
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

    @MaxLength(256, { each: true, message: 'Too short for field «image»' })
    @Matches(/.jpg|.png/, {
        each: true,
        message: 'image must have format .jpg or .png',
    })
    public avatarPath?: string;

    @IsBoolean({ message: 'userType is must be boolean' })
    public userType!: boolean;

    @IsString({ message: 'is required' })
    @Length(6, 12, { message: 'Min length for password is 6, max is 12' })
    public password!: string;
}
