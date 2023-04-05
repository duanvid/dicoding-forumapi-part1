const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ useCasePayload, credentialId, threadId }) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadId(threadId);
    return this._commentRepository.addComment({ newComment, credentialId, threadId });
  }
}

module.exports = AddCommentUseCase;
