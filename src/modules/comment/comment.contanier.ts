import { Container } from 'inversify';
import { AppComponent } from '../../enum/app-component.enum';
import { commentModel } from './comment.entity';
import { CommentService } from './comment.service';

export function createCommentContainer() {
    const container = new Container();
    container
        .bind(AppComponent.CommentServiceInterface)
        .to(CommentService)
        .inSingletonScope();
    container.bind(AppComponent.CommentModel).toConstantValue(commentModel);

    return container;
}
