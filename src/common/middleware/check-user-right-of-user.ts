import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../error/http.error';
import { MiddlewareInterface } from './middleware.interface';

export class CheckUserRightOfUser implements MiddlewareInterface {
    execute(req: Request, _res: Response): void {
        const { userId } = req.params;
        const { id } = req.user;
        if (userId !== id) {
            throw new HttpError(
                StatusCodes.FORBIDDEN,
                'Пользователь может обращаться только к своему аккаунту',
                'CheckUserMatchInOfferMiddleware',
            );
        }
    }
}
