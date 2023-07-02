import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../enum/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { createErrorObject } from '../../helpers/error-object.js';
import { ServiceError } from '../../enum/service-error.enum.js';

@injectable()
export default class BaseExceptionFilter implements ExceptionFilterInterface {
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
    ) {
        this.logger.info('Register BaseExceptionFilter');
    }

    public catch(
        error: Error,
        _req: Request,
        res: Response,
        _next: NextFunction,
    ) {
        this.logger.error(`[BaseException]: ${error.message}`);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            createErrorObject(ServiceError.ServiceError, error.message),
        );
    }
}
