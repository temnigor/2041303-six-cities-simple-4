import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { HttpMethod } from '../../../enum/http-method.enum.js';
import { UserServiceInterface } from './user.service.interface';
import CreateUserDTO from './dto/create-user.dto.js';
import UpdateUserDTO from './dto/update-user.dto.js';
import UserRDO from './rdo/user.rdo.js';
import HttpError from '../../error/http.error.js';
import { StatusCodes } from 'http-status-codes';
import { LoginUserDto } from './dto/login-user.dto.js';
import { Controller } from '../../controller/controller.js';
import { ConfigInterface } from '../../config/config.interface';
import { ConfigSchema } from '../../config/config.schema';
import { fillDTO } from '../../../helpers/fill-dto.js';
import { ValidateDtoMiddleware } from '../../middleware/validate-dto.middleware.js';
import { UploadFileMiddleware } from '../../middleware/upload-file.middleware.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import * as core from 'express-serve-static-core';
import LoginUserRDO from './rdo/logen-user.rdo.js';
import { createJWT } from '../../../helpers/jwt.js';
import { JWT_ALGORITHM } from './user.constant.js';
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware';
import TokenAndUserRDO from './rdo/token-and -user.rdo';

type ParamUser = {
    userId: string;
};

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
            path: '/update/:userId',
            method: HttpMethod.Post,
            handler: this.update,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateDtoMiddleware(UpdateUserDTO),
            ],
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

        this.addRoute({
            path: '/login',
            method: HttpMethod.Get,
            handler: this.checkAuthenticate,
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
            params,
            body,
        }: Request<
            core.ParamsDictionary | ParamUser,
            Record<string, unknown>,
            UpdateUserDTO
        >,
        res: Response,
    ) {
        const user = await this.userService.findById(params.userId);
        if (!user) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                'Error user not update. This user not exist',
                'UserController',
            );
        }
        const update = this.userService.findAndUpdate(params.userId, body);
        this.ok(res, fillDTO(UserRDO, update));
    }

    public async uploadAvatar(req: Request, res: Response) {
        this.created(res, {
            filepath: req.file?.path,
        });
    }

    public async login(
        {
            body,
        }: Request<
            Record<string, unknown>,
            Record<string, unknown>,
            LoginUserDto
        >,
        res: Response,
    ) {
        const salt = (await this.configService.get('JWT_SECRET')) as string;
        const user = await this.userService.verifyUser(body, salt);
        if (!user) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                'UNAUTHORIZED',
                'UserService',
            );
        }
        const token = await createJWT(JWT_ALGORITHM, salt, {
            id: user.id,
            email: user.email,
        });
        return this.ok(
            res,
            fillDTO(LoginUserRDO, { email: user.email, token }),
        );
    }

    public async checkAuthenticate(
        { user: { email } }: Request,
        res: Response,
    ) {
        const foundedUser = await this.userService.findByEmail(email);

        if (!foundedUser) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                'Unauthorized',
                'UserController',
            );
        }

        this.ok(res, fillDTO(TokenAndUserRDO, foundedUser));
    }
}
