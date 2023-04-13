class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute(payload) {
    await this._threadRepository.verifyThreadId(payload);
    const ThreadDetail = await this._threadRepository.getThreadById(payload);
    const ThreadComments = await this._commentRepository.getAllCommentsByThreadId(payload);
    const CommentReplies = await this._repliesRepository.getAllRepliesByThreadId(payload);
    const ThreadCommentsWithReplies = ThreadComments.map((comment) => ({
      ...comment, replies: CommentReplies.filter((reply) => (reply.commentId === comment.id)),
    }));
    return { ...ThreadDetail, comments: ThreadCommentsWithReplies };
  }
}

module.exports = GetThreadDetailUseCase;
