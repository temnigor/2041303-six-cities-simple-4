import { types, DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import CreateUserDTO from './create-user.dto';
import UpdateUserDTO from './update-user.dto';
import { UserEntity } from './user.entity.js';
import { UserServiceInterface } from './user.service.interface';

@injectable()
export class UserService implements UserServiceInterface {
    constructor(
        @inject(AppComponent.LoggerInterface) private logger: LoggerInterface,
        @inject(AppComponent.UserModel)
        private userModel: types.ModelType<UserEntity>,
    ) {}

    public async exist(email: string): Promise<boolean> {
        return Boolean(await this.userModel.findOne({ email: email }));
    }

    public async create(data: CreateUserDTO, salt: string) {
        const user = new UserEntity(data);
        user.setPassword(data.password, salt);

        const freshUser = await this.userModel.create(user);

        this.logger.info(`user was create ${user.name}`);

        return freshUser;
    }

    public async findById(
        id: string,
    ): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findById(id);
    }

    findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({ email });
    }

    public async findAndUpdate(
        id: string,
        data: UpdateUserDTO,
    ): Promise<DocumentType<UserEntity> | null> {
        const updateUser = await this.userModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        this.logger.info('user update');
        return updateUser;
    }
}