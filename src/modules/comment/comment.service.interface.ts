import { CommentEntity } from './comment.entity';
import { CommentDTO } from './create-comment.dto';

export interface CommentServiceInterface {
    create(data: CommentDTO): Promise<CommentEntity>;
}
