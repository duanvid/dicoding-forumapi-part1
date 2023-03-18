const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");

class CommentHandler {
    constructor(container) {
        this._container = container;

        this.postCommentsHandler = this.postCommentsHandler.bind(this);
    }

    async postCommentsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { threadId } = request.params;
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute({ useCasePayload: request.payload, credentialId, threadId });

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = CommentHandler;