import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment.service.interface';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { SortType } from '../../../enum/sort-type.enum.js';

@injectable()
export class CommentService implements CommentServiceInterface {
    constructor(
        @inject(AppComponent.LoggerInterface) private logger: LoggerInterface,
        @inject(AppComponent.CommentModel)
        private commentModel: types.ModelType<CommentEntity>,
    ) {}

    public async create(data: CreateCommentDTO) {
        const freshComment = await this.commentModel.create(data);
        this.logger.info('create comment');
        return freshComment.populate(['userId']);
    }

    public async findById(id: string) {
        return this.commentModel.findById(id);
    }

    public async exists(id: string): Promise<boolean> {
        return this.commentModel.exists({ id }) !== null;
    }

    public async find(
        offerId: string,
        count: number,
    ): Promise<types.DocumentType<CommentEntity>[] | null> {
        return this.commentModel
            .find({ offerId: offerId })
            .populate(['userId'])
            .sort({ createdAt: SortType.Down })
            .limit(count)
            .exec();
    }

    public async destroyByOfferId(offerId: string) {
        return this.commentModel.deleteMany({ offerId: offerId });
    }
}
