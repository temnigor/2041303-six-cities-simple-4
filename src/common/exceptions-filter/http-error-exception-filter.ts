import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum.js';
import { ServiceError } from '../../enum/service-error.enum.js';
import { createErrorObject } from '../../helpers/error-object.js';
import HttpError from '../error/http.error.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ExceptionFilterInterface } from './exception-filter.interface.js';

@injectable()
export default class HttpErrorExceptionFilter
    implements ExceptionFilterInterface
{
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
    ) {
        this.logger.info('Register HttpErrorExceptionFilter');
    }

    public catch(
        error: unknown,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (!(error instanceof HttpError)) {
            return next(error);
        }

        this.logger.error(
            `[HttpErrorException]: ${req.path} # ${error.message}`,
        );

        res.status(StatusCodes.BAD_REQUEST).json(
            createErrorObject(ServiceError.CommonError, error.message),
        );
    }
}
