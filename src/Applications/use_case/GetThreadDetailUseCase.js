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
    const ThreadCommentsWithReplies = await Promise.all(ThreadComments.map(async (comment) => ({
      ...comment, replies: await this._repliesRepository.getAllRepliesByCommentId(comment.id),
    })));
    return { ...ThreadDetail, comments: ThreadCommentsWithReplies };
  }
}

module.exports = GetThreadDetailUseCase;
