import { Expose } from 'class-transformer';

export default class UploadPreviewImageRDO {
    @Expose()
    public previewImage!: string;
}
