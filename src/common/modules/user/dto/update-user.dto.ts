import { MaxLength } from 'class-validator';
import { USER_IMAGE_LENGTH } from '../user.constant.js';

export default class UpdateUserDTO {
    @MaxLength(USER_IMAGE_LENGTH, {
        each: true,
        message: 'Too short for field «image»',
    })
    public avatarPath!: string;
}
