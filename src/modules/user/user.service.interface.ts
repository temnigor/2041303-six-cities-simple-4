import { DocumentType } from '@typegoose/typegoose';
import CreateUserDTO from './create-user.dto.js';
import UpdateUserDTO from './update-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface {
    create(
        data: CreateUserDTO,
        salt: string,
    ): Promise<DocumentType<UserEntity>>;
    findById(id: string): Promise<DocumentType<UserEntity> | null>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(
        data: CreateUserDTO,
        salt: string,
    ): Promise<DocumentType<UserEntity>>;
    findAndUpdate(
        id: string,
        data: UpdateUserDTO,
    ): Promise<DocumentType<UserEntity> | null>;
}
