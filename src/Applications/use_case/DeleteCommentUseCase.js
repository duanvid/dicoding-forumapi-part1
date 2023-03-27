class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParameters) {
    const { threadId, commentId, userId } = useCaseParameters;
    await this._commentRepository.verifyThreadComment(threadId, commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
