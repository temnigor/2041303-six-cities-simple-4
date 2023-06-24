import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../app/logger/loger.interfase';
import { AppComponent } from '../../enum/app-component.enum';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment.service.interface';
import { CommentEntity } from './comment.entity';
import { CommentDTO } from './create-comment.dto';

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
}
