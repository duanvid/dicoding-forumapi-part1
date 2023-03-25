const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentHandler {
    constructor(container) {
        this._container = container;

        this.postCommentsHandler = this.postCommentsHandler.bind(this);
        this.deleteCommentsHandler = this.deleteCommentsHandler.bind(this);
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

    async deleteCommentsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const useCaseParameters = {
            threadId,
            commentId,
            userId: credentialId
        }
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute(useCaseParameters);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menghapus komentar'
        });
        response.code(200);
        return response;
    }
}

module.exports = CommentHandler;