import { Container } from 'inversify';
import { AppComponent } from '../../../enum/app-component.enum.js';
import { ControllerInterface } from '../../controller/controller.interface.js';
import { CommentController } from './comment.controller.js';

import { commentModel } from './comment.entity.js';
import { CommentServiceInterface } from './comment.service.interface.js';
import { CommentService } from './comment.service.js';

export function createCommentContainer() {
    const container = new Container();
    container
        .bind<CommentServiceInterface>(AppComponent.CommentServiceInterface)
        .to(CommentService)
        .inSingletonScope();
    container.bind(AppComponent.CommentModel).toConstantValue(commentModel);
    container
        .bind<ControllerInterface>(AppComponent.CommentController)
        .to(CommentController)
        .inSingletonScope();

    return container;
}
