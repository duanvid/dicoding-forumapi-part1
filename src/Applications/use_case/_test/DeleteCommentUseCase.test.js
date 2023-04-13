const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseParameters = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** use case dependencies */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyThreadComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    /** use case instances */
    const deleteComment = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteComment.execute(useCaseParameters);

    // Assert
    expect(mockCommentRepository.verifyThreadComment)
      .toBeCalledWith(useCaseParameters.threadId, useCaseParameters.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCaseParameters.commentId, useCaseParameters.userId);
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(useCaseParameters.commentId);
  });
});
