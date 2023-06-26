import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum.js';
import { UserEntity, userModel } from './user.entity.js';
import { UserService } from './user.service.js';
import { UserServiceInterface } from './user.service.interface.js';

export function createUserServiceContainer() {
    const userServiceContainer = new Container();

    userServiceContainer
        .bind<UserServiceInterface>(AppComponent.UserServiceInterface)
        .to(UserService)
        .inSingletonScope();
    userServiceContainer
        .bind<types.ModelType<UserEntity>>(AppComponent.UserModel)
        .toConstantValue(userModel);

    return userServiceContainer;
}
