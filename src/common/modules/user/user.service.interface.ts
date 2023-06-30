import { DocumentType } from '@typegoose/typegoose';
import CreateUserDTO from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import UpdateUserDTO from './dto/update-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface {
    exist(email: string): Promise<boolean>;
    create(
        data: CreateUserDTO,
        salt: string,
    ): Promise<DocumentType<UserEntity>>;
    findById(id: string): Promise<DocumentType<UserEntity> | null>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findAndUpdate(
        id: string,
        data: UpdateUserDTO,
    ): Promise<DocumentType<UserEntity> | null>;

    verifyUser(
        dto: LoginUserDto,
        salt: string,
    ): Promise<DocumentType<UserEntity> | null>;
}
