const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddcommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'thread comment',
    };
    const threadId = 'thread-123';
    const credentialId = 'user-123';

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: credentialId,
    });
    const newComment = new NewComment(useCasePayload);

    /** use case dependencies */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** use case instances */
    const getAddedCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getAddedCommentUseCase.execute({
      useCasePayload, credentialId, threadId,
    });

    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockCommentRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith({ newComment, credentialId, threadId });
  });
});
