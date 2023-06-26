import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../app/logger/loger.interface';
import { AppComponent } from '../../enum/app-component.enum.js';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment.service.interface';
import { CommentEntity } from './comment.entity.js';
import { CommentDTO } from './create-comment.dto.js';
import { SortType } from '../../enum/sort-type.enum';

const DEFAULT_COMMENT_COUNT_LIMIT = 50;

@injectable()
export class CommentService implements CommentServiceInterface {
    constructor(
        @inject(AppComponent.LoggerInterface) private logger: LoggerInterface,
        @inject(AppComponent.CommentModel)
        private commentModel: types.ModelType<CommentEntity>,
    ) {}

    public async create(data: CommentDTO) {
        const freshComment = await this.commentModel.create(data);
        this.logger.info('create comment');
        return freshComment;
    }

    public async find(
        offerId: string,
        count: number = DEFAULT_COMMENT_COUNT_LIMIT,
    ): Promise<types.DocumentType<CommentEntity>[] | null> {
        let commentCount = count;
        if (count > DEFAULT_COMMENT_COUNT_LIMIT) {
            commentCount = DEFAULT_COMMENT_COUNT_LIMIT;
        }
        return this.commentModel
            .find({ offerId: offerId })
            .sort({ createdAt: SortType.Down })
            .limit(commentCount)
            .exec();
    }
}
