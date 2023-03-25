const NewComment = require("../../Domains/comments/entities/NewComment")

class AddCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository
    }

    async execute({ useCasePayload, credentialId, threadId }) {
        const newComment = new NewComment(useCasePayload);
        await this._commentRepository.verifyThreadId(threadId);
        return this._commentRepository.addComment({ newComment, credentialId, threadId })
    }
}

module.exports = AddCommentUseCase;
