const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const DeleteRepliesUseCase = require('../DeleteRepliesUseCase');

describe('DeleteRepliesUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCaseParameters = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
      replyId: 'reply-123',
    };

    /** use case dependencies */
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mock needed function */
    mockCommentRepository.verifyThreadComment = jest.fn(() => Promise.resolve());
    mockRepliesRepository.verifyCommentReplies = jest.fn(() => Promise.resolve());
    mockRepliesRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockRepliesRepository.deleteReplyById = jest.fn(() => Promise.resolve());

    /** use case instances */
    const deleteReply = new DeleteRepliesUseCase({
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    await deleteReply.execute(useCaseParameters);

    // Assert
    expect(mockCommentRepository.verifyThreadComment)
      .toBeCalledWith(useCaseParameters.threadId, useCaseParameters.commentId);
    expect(mockRepliesRepository.verifyCommentReplies)
      .toBeCalledWith(useCaseParameters.commentId, useCaseParameters.replyId);
    expect(mockRepliesRepository.verifyReplyOwner)
      .toBeCalledWith(useCaseParameters.replyId, useCaseParameters.userId);
    expect(mockRepliesRepository.deleteReplyById)
      .toBeCalledWith(useCaseParameters.replyId);
  });
});
