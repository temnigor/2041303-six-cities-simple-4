import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import HttpError from '../../error/http.error.js';

import { AppComponent } from '../../../enum/app-component.enum.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { createErrorObject } from '../../../helpers/error-object.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
    ) {
        this.logger.info('Register ExceptionFilter');
    }

    private handleHttpError(
        error: HttpError,
        _req: Request,
        res: Response,
        _next: NextFunction,
    ) {
        this.logger.error(
            `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`,
        );
        res.status(error.httpStatusCode).json(createErrorObject(error.message));
    }

    private handleOtherError(
        error: Error,
        _req: Request,
        res: Response,
        _next: NextFunction,
    ) {
        this.logger.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            createErrorObject(error.message),
        );
    }

    public catch(
        error: Error | HttpError,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (error instanceof HttpError) {
            return this.handleHttpError(error, req, res, next);
        }

        this.handleOtherError(error, req, res, next);
    }
}
