import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum';
import { UserEntity, userModel } from './user.entity';
import { UserService } from './user.service';
import { UserServiceInterface } from './user.service.interface';

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
