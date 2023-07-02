import { Expose } from 'class-transformer';

export default class UploadHouseImageRDO {
    @Expose()
    public houseImage!: string[];
}
