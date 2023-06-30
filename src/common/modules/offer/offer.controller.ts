import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { LoggerInterface } from '../../logger/logger.interface';
import HttpError from '../../error/http.error.js';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { HttpMethod } from '../../../enum/http-method.enum.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { ManyOfferRDO } from './rdo/many-offer.rdo.js';
import { OfferServiceInterface } from './offer-service.interface';
import { OfferRDO } from './rdo/offer.rdo.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Controller } from '../../controller/controller.js';
import { fillDTO } from '../../../helpers/fill-dto.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../middleware/document-exist.middleware.js';
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware.js';

const DEFAULT_OFFERS_COUNT_LIMIT = 60;
type ParamsOfferId = {
    offerId: string;
};
type ParamsOfferCount = {
    offerCount: string;
};

@injectable()
export class OfferController extends Controller {
    constructor(
        @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
        @inject(AppComponent.OfferServiceInterface)
        private readonly offerService: OfferServiceInterface,
    ) {
        super(logger);
        this.addRoute({
            path: '/create',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [
                new PrivateRouteMiddleware(),
                new ValidateDtoMiddleware(CreateOfferDTO),
            ],
        });
        this.addRoute({
            path: '/update/:offerId',
            method: HttpMethod.Patch,
            handler: this.update,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(
                    this.offerService,
                    'Offer',
                    'offerId',
                ),
                new PrivateRouteMiddleware(),
                new ValidateDtoMiddleware(UpdateOfferDto),
            ],
        });
        this.addRoute({
            path: '/delete/:offerId',
            method: HttpMethod.Delete,
            handler: this.destroy,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(
                    this.offerService,
                    'Offer',
                    'offerId',
                ),
                new PrivateRouteMiddleware(),
            ],
        });
        this.addRoute({
            path: '/offers/:offerCount',
            method: HttpMethod.Get,
            handler: this.index,
        });
        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Get,
            handler: this.show,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(
                    this.offerService,
                    'Offer',
                    'offerId',
                ),
            ],
        });
    }

    public async create(
        {
            body,
            user,
        }: Request<
            Record<string, unknown>,
            Record<string, unknown>,
            CreateOfferDTO
        >,
        res: Response,
    ): Promise<void> {
        const create = await this.offerService.create({
            ...body,
            userId: user.id,
        });
        const offer = await this.offerService.findById(create.id);

        this.created(res, fillDTO(OfferRDO, offer));
        throw new HttpError(
            StatusCodes.BAD_REQUEST,
            'Offer not create',
            'OfferController',
        );
    }

    public async update(
        {
            params,
            body,
        }: Request<
            core.ParamsDictionary | ParamsOfferId,
            Record<string, unknown>,
            UpdateOfferDto
        >,
        res: Response,
    ) {
        await this.offerService.updateById(params.offerId, body);
        const offer = await this.offerService.findById(params.offerId);
        this.ok(res, fillDTO(OfferRDO, offer));
    }

    public async destroy(
        { params }: Request<core.ParamsDictionary | ParamsOfferId>,
        res: Response,
    ) {
        const { offerId } = params;

        await this.offerService.deleteById(offerId);
        this.noContent(res, `offer id${offerId} was delete `);
        throw new HttpError(StatusCodes.BAD_REQUEST, 'Oops', 'OfferController');
    }

    public async index(
        { params }: Request<core.ParamsDictionary | ParamsOfferCount>,
        res: Response,
    ) {
        const { offerCount } = params;
        let count = parseInt(offerCount, 10);
        if (count === undefined) {
            count = DEFAULT_OFFERS_COUNT_LIMIT;
        }
        const offers = await this.offerService.find(count);
        this.ok(res, fillDTO(ManyOfferRDO, offers));
    }

    public async show(
        { params }: Request<core.ParamsDictionary | ParamsOfferId>,
        res: Response,
    ): Promise<void> {
        const { offerId } = params;
        const offer = this.offerService.findById(offerId);
        this.ok(res, fillDTO(OfferRDO, offer));
    }
}
