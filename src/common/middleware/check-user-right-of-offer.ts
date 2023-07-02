import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
import HttpError from '../error/http.error.js';

export class CheckUserRightOfOffer implements MiddlewareInterface {
    constructor(private readonly service: OfferServiceInterface) {}

    public async execute(
        req: Request,
        _res: Response,
        next: NextFunction,
    ): Promise<void> {
        const { offerId } = req.params;
        const { id } = req.user;
        const offer = await this.service.findById(offerId);
        const offerUserId = offer?.userId._id.toString();

        if (offerUserId !== id) {
            throw new HttpError(
                StatusCodes.FORBIDDEN,
                'Пользователь может обращаться только к своему Обявлению',
                'CheckUserMatchInOfferMiddleware',
            );
        }

        return next();
    }
}
