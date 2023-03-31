class DeleteRepliesUseCase {
  constructor({ commentRepository, repliesRepository }) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(useCaseParameters) {
    const {
      threadId, commentId, replyId, userId,
    } = useCaseParameters;
    await this._commentRepository.verifyThreadComment(threadId, commentId);
    await this._repliesRepository.verifyCommentReplies(commentId, replyId);
    await this._repliesRepository.verifyReplyOwner(replyId, userId);
    await this._repliesRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteRepliesUseCase;
