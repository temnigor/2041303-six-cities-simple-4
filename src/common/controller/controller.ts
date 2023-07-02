import 'reflect-metadata';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { RouteInterface } from './route.interface.js';
import { injectable } from 'inversify';
import { ConfigInterface } from '../config/config.interface.js';
import { ConfigSchema } from '../config/config.schema.js';
import { getFullServerPath } from '../../helpers/server-path.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/rest.constant.js';
import { transformObject } from '../../helpers/transform-from -static-path.js';

@injectable()
export abstract class Controller implements ControllerInterface {
    private readonly _router: Router;

    constructor(
        protected readonly logger: LoggerInterface,
        protected readonly configService: ConfigInterface<ConfigSchema>,
    ) {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    public addRoute(route: RouteInterface) {
        const routeHandler = asyncHandler(route.handler.bind(this));
        const middlewares = route.middlewares?.map(middleware =>
            asyncHandler(middleware.execute.bind(middleware)),
        );

        const allHandler = middlewares
            ? [...middlewares, routeHandler]
            : routeHandler;

        this._router[route.method](route.path, allHandler);
        this.logger.info(
            `Route registered: ${route.method.toUpperCase()} ${route.path}`,
        );
    }

    protected addStaticPath(data: Record<string, unknown>): void {
        const fullServerPath = getFullServerPath(
            this.configService.get('HOST') as string,
            this.configService.get('PORT') as number,
        );
        transformObject(
            STATIC_RESOURCE_FIELDS,
            `${fullServerPath}/${this.configService.get(
                'STATIC_DIRECTORY_PATH',
            )}`,
            `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
            data,
        );
    }

    public send<T>(res: Response, statusCode: number, data: T): void {
        this.addStaticPath(data as Record<string, unknown>);
        res.type('application/json').status(statusCode).json(data);
    }

    public created<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.CREATED, data);
    }

    public noContent<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.NO_CONTENT, data);
    }

    public ok<T>(res: Response, data: T): void {
        this.send(res, StatusCodes.OK, data);
    }
}
