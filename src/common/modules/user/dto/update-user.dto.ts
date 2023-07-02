import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import {
    USER_IMAGE_LENGTH,
    USER_NAME_MAX,
    USER_NAME_MIN,
} from '../user.constant';

export default class UpdateUserDTO {
    @IsOptional()
    @IsString({ message: 'is required' })
    @MaxLength(USER_NAME_MAX, { message: 'name length max 15 symbol' })
    @MinLength(USER_NAME_MIN, { message: 'name min length 1' })
    public name?: string;

    @IsOptional()
    @MaxLength(USER_IMAGE_LENGTH, {
        each: true,
        message: 'Too short for field «image»',
    })
    public avatarPath?: string;
}
