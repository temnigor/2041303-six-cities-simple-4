import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { HttpMethod } from '../../../enum/http-method.enum.js';
import { UserServiceInterface } from './user.service.interface';
import CreateUserDTO from './dto/create-user.dto.js';
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
import LoginUserRDO from './rdo/logen-user.rdo.js';
import { createJWT } from '../../../helpers/jwt.js';
import { JWT_ALGORITHM } from './user.constant.js';
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware.js';
import TokenAndUserRDO from './rdo/token-and -user.rdo.js';
import UploadUserAvatarRDO from './rdo/upload-user-avatar.rdo.js';
import { CheckUserRightOfUser } from '../../middleware/check-user-right-of-user.js';

@injectable()
export class UserController extends Controller {
    constructor(
        @inject(AppComponent.LoggerInterface)
        protected logger: LoggerInterface,
        @inject(AppComponent.UserServiceInterface)
        private readonly userService: UserServiceInterface,
        @inject(AppComponent.ConfigInterface)
        configService: ConfigInterface<ConfigSchema>,
    ) {
        super(logger, configService);
        this.addRoute({
            path: '/register',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [new ValidateDtoMiddleware(CreateUserDTO)],
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
                new PrivateRouteMiddleware(),
                new CheckUserRightOfUser(),
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

    public async uploadAvatar(req: Request, res: Response) {
        const { userId } = req.body;

        if (req.file === undefined) {
            throw new HttpError(
                StatusCodes.NO_CONTENT,
                'not found file',
                'UserController',
            );
        }
        const uploadFile = { avatarPath: req.file.filename };
        await this.userService.findAndUpdate(userId, uploadFile);
        this.created(res, fillDTO(UploadUserAvatarRDO, uploadFile));
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

        return this.ok(res, { ...fillDTO(LoginUserRDO, user), token });
    }

    public async checkAuthenticate(req: Request, res: Response) {
        if (!req.user) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                'Unauthorized',
                'UserController',
            );
        }
        const { email } = req.user;
        const foundedUser = await this.userService.findByEmail(email);
        this.ok(res, fillDTO(TokenAndUserRDO, foundedUser));
    }
}
