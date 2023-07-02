import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { HttpMethod } from '../../../enum/http-method.enum.js';
import { CommentServiceInterface } from './comment.service.interface.js';
import { CommentRDO } from './rdo/comment.rdo.js';
import * as core from 'express-serve-static-core';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import HttpError from '../../error/http.error.js';
import { StatusCodes } from 'http-status-codes';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { Controller } from '../../controller/controller.js';
import { fillDTO } from '../../../helpers/fill-dto.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../middleware/document-exist.middleware.js';
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware.js';
import { ConfigInterface } from '../../config/config.interface';
import { ConfigSchema } from '../../config/config.schema';

type ParamsCommentOffer = {
    offerId: string;
    commentCount: string;
};
type ParamsCommentCreate = {
    offerId: string;
};

const DEFAULT_COMMENT_COUNT_LIMIT = 50;

@injectable()
export class CommentController extends Controller {
    constructor(
        @inject(AppComponent.LoggerInterface) protected logger: LoggerInterface,
        @inject(AppComponent.ConfigInterface)
        configService: ConfigInterface<ConfigSchema>,
        @inject(AppComponent.CommentServiceInterface)
        private readonly commentService: CommentServiceInterface,
        @inject(AppComponent.OfferServiceInterface)
        private readonly offerService: OfferServiceInterface,
    ) {
        super(logger, configService);

        this.logger.info('Register routes for CommentController…');

        this.addRoute({
            path: '/:offerId/:commentCount',
            method: HttpMethod.Get,
            handler: this.index,
            middlewares: [new ValidateObjectIdMiddleware('offerId')],
        });
        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Post,
            handler: this.create,
            middlewares: [
                new ValidateObjectIdMiddleware('offerId'),
                new DocumentExistsMiddleware(
                    this.commentService,
                    'Comment',
                    'commentId',
                ),
                new PrivateRouteMiddleware(),
                new ValidateDtoMiddleware(CreateCommentDTO),
            ],
        });
    }

    public async index(
        { params }: Request<core.ParamsDictionary | ParamsCommentOffer>,
        res: Response,
    ): Promise<void> {
        if (!(await this.offerService.exists(params.offerId))) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                'Error offer not found',
                'CommentController',
            );
        }

        let count = parseInt(params.commentCount, 10);
        if (count === undefined || count > DEFAULT_COMMENT_COUNT_LIMIT) {
            count = DEFAULT_COMMENT_COUNT_LIMIT;
        }
        const comments = await this.commentService.find(params.offerId, count);
        const commentsResponse = fillDTO(CommentRDO, comments);
        this.ok(res, commentsResponse);
        throw new HttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error comment not found',
            'CommentController',
        );
    }

    public async create(
        {
            params,
            body,
            user,
        }: Request<
            core.ParamsDictionary | ParamsCommentCreate,
            Record<string, unknown>,
            CreateCommentDTO
        >,
        res: Response,
    ): Promise<void> {
        if (!(await this.offerService.exists(params.offerId))) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                'Error offer not found',
                'CommentController',
            );
        }
        const create = await this.commentService.create({
            ...body,
            userId: user.id,
        });
        const comment = await this.commentService.findById(create.id);
        await this.offerService.incCommentCount(params.offerId);
        this.created(res, fillDTO(CommentRDO, comment));
        throw new HttpError(
            StatusCodes.BAD_REQUEST,
            'Error comment not create',
            'CommentController',
        );
    }
}
