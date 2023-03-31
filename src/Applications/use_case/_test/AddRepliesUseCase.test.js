const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies');
const NewReplies = require('../../../Domains/replies/entities/NewReplies');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const AddRepliesUseCase = require('../AddRepliesUseCase');

describe('AddRepliesUseCase', () => {
  it('should orchestrating the add replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment replies',
    };
    const useCaseParameter = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const credentialId = 'user-123';

    const expectedAddedReplies = new AddedReplies({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: credentialId,
    });

    const newReplies = new NewReplies(useCasePayload);

    /** use case dependencies */
    const mockRepliesRepository = new RepliesRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.addReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReplies({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: credentialId,
      })));

    /** use case instances */
    const getAddedRepliesUseCase = new AddRepliesUseCase({
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const addedReplies = await getAddedRepliesUseCase.execute({
      useCasePayload, credentialId, useCaseParameter,
    });

    // Assert
    expect(addedReplies).toStrictEqual(expectedAddedReplies);
    expect(mockCommentRepository.verifyThreadComment)
      .toBeCalledWith(useCaseParameter.threadId, useCaseParameter.commentId);
    expect(mockRepliesRepository.addReplies)
      .toBeCalledWith({ newReplies, credentialId, commentId: useCaseParameter.commentId });
  });
});
