import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from './middleware.interface.js';
import ValidationError from '../error/validate-error.js';
import { transformValidateError } from '../../helpers/validate-error-transform.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
    constructor(private dto: ClassConstructor<object>) {}
    public async execute(
        req: Request,
        _res: Response,
        next: NextFunction,
    ): Promise<void> {
        const { body } = req;
        const dtoInstance = plainToInstance(this.dto, body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            throw new ValidationError(
                `Validation error: "${req.path}"`,
                transformValidateError(errors),
            );
        }

        next();
    }
}
