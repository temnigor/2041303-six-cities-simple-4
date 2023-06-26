import { Container } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum.js';
import { commentModel } from './comment.entity.js';
import { CommentService } from './comment.service.js';

export function createCommentContainer() {
    const container = new Container();
    container
        .bind(AppComponent.CommentServiceInterface)
        .to(CommentService)
        .inSingletonScope();
    container.bind(AppComponent.CommentModel).toConstantValue(commentModel);

    return container;
}
