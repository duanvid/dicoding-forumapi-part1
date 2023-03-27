class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    await this._threadRepository.verifyThreadId(payload);
    const comments = await this._commentRepository.getAllCommentsByThreadId(payload);
    const threadDetail = await this._threadRepository.getThreadById(payload);
    const thread = { ...threadDetail, comments };
    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
