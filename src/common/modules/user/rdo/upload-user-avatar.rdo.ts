import { Expose } from 'class-transformer';

export default class UploadUserAvatarRDO {
    @Expose()
    public avatarPath!: string;
}
