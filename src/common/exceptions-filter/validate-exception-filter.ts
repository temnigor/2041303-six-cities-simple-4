import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../enum/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ValidationError from '../error/validate-error.js';
import { createErrorObject } from '../../helpers/error-object.js';
import { ServiceError } from '../../enum/service-error.enum.js';

@injectable()
export default class ValidationExceptionFilter
    implements ExceptionFilterInterface
{
    constructor(
        @inject(AppComponent.LoggerInterface)
        private readonly logger: LoggerInterface,
    ) {
        this.logger.info('Register ValidationExceptionFilter');
    }

    public catch(
        error: unknown,
        _req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (!(error instanceof ValidationError)) {
            return next(error);
        }

        this.logger.error(`[ValidationException]: ${error.message}`);

        error.details.forEach(errorField =>
            this.logger.error(
                `[${errorField.property}] — ${errorField.messages}`,
            ),
        );

        res.status(StatusCodes.BAD_REQUEST).json(
            createErrorObject(
                ServiceError.ValidationError,
                error.message,
                error.details,
            ),
        );
    }
}
