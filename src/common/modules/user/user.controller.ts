import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { HttpMethod } from '../../../enum/http-method.enum.js';
import { UserServiceInterface } from './user.service.interface';
import CreateUserDTO from './create-user.dto.js';
import UpdateUserDTO from './update-user.dto.js';
import UserRDO from './user.rdo.js';
import HttpError from '../../error/http.error.js';
import { StatusCodes } from 'http-status-codes';
import { LoginUserDto } from './login-user.dto.js';
import { Controller } from '../../controller/controller.js';
import { ConfigInterface } from '../../config/config.interface';
import { ConfigSchema } from '../../config/config.schema';
import { fillDTO } from '../../../helpers/fill-dto.js';
import { ValidateDtoMiddleware } from '../../middleware/validate-dto.middleware';
import { UploadFileMiddleware } from '../../middleware/upload-file.middleware';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware';

@injectable()
export class UserController extends Controller {
    constructor(
        @inject(AppComponent.LoggerInterface)
        protected logger: LoggerInterface,
        @inject(AppComponent.UserServiceInterface)
        private readonly userService: UserServiceInterface,
        @inject(AppComponent.ConfigInterface)
        private readonly configService: ConfigInterface<ConfigSchema>,
    ) {
        super(logger);
        this.addRoute({
            path: '/register',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [new ValidateDtoMiddleware(CreateUserDTO)],
        });
        this.addRoute({
            path: '/update',
            method: HttpMethod.Post,
            handler: this.update,
            middlewares: [new ValidateDtoMiddleware(UpdateUserDTO)],
        });

        this.addRoute({
            path: '/login',
            method: HttpMethod.Post,
            handler: this.login,
            middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
        });
        this.addRoute({
            path: '/:userId/avatar',
            method: HttpMethod.Post,
            handler: this.uploadAvatar,
            middlewares: [
                new ValidateObjectIdMiddleware('userId'),
                new UploadFileMiddleware(
                    this.configService.get('UPLOAD_DIRECTORY') as string,
                    'avatar',
                ),
            ],
        });
    }

    public async create(
        {
            body,
        }: Request<
            Record<string, unknown>,
            Record<string, unknown>,
            CreateUserDTO
        >,
        res: Response,
    ): Promise<void> {
        const user = await this.userService.findByEmail(body.email);
        if (user) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                'Error user not create. This email is already use',
                'UserController',
            );
        }
        const createUser = await this.userService.create(
            body,
            this.configService.get('SALT') as string,
        );
        this.created(res, fillDTO(UserRDO, createUser));
    }

    public async update(
        {
            body,
        }: Request<
            Record<string, unknown>,
            Record<string, unknown>,
            UpdateUserDTO
        >,
        res: Response,
    ) {
        const user = await this.userService.findById(body.id);
        if (!user) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                'Error user not update. This user not exist',
                'UserController',
            );
        }
        const update = this.userService.findAndUpdate(body.id, body);
        this.ok(res, fillDTO(UserRDO, update));
    }

    public async login(
        {
            body,
        }: Request<
            Record<string, unknown>,
            Record<string, unknown>,
            LoginUserDto
        >,
        _res: Response,
    ): Promise<void> {
        const existsUser = await this.userService.findByEmail(body.email);

        if (!existsUser) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                `User with email ${body.email} not found.`,
                'UserController',
            );
        }

        throw new HttpError(
            StatusCodes.NOT_IMPLEMENTED,
            'Not implemented',
            'UserController',
        );
    }

    public async uploadAvatar(req: Request, res: Response) {
        this.created(res, {
            filepath: req.file?.path,
        });
    }
}
