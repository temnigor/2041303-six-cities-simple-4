import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'email must be valid address' })
    public email!: string;

    @IsString({ message: 'is required' })
    @Length(6, 12, { message: 'Min length for password is 6, max is 12' })
    public password!: string;
}
