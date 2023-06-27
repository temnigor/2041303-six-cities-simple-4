import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity';
import { CreateCommentDTO } from './dto/create-comment.dto';

export interface CommentServiceInterface {
    create(data: CreateCommentDTO): Promise<DocumentType<CommentEntity>>;
    findById(id: string): Promise<DocumentType<CommentEntity> | null>;
    find(
        offerId: string,
        count: number,
    ): Promise<DocumentType<CommentEntity>[] | null>;
}
