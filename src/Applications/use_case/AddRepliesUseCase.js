const NewReplies = require('../../Domains/replies/entities/NewReplies');

class AddRepliesUseCase {
  constructor({ commentRepository, repliesRepository }) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
  }

  async execute({ useCasePayload, credentialId, useCaseParameter }) {
    const newReplies = new NewReplies(useCasePayload);
    const { threadId, commentId } = useCaseParameter;
    await this._commentRepository.verifyThreadComment(threadId, commentId);
    return this._repliesRepository.addReplies({ newReplies, credentialId, commentId });
  }
}

module.exports = AddRepliesUseCase;
