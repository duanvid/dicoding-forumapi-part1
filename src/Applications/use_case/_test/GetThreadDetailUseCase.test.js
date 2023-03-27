const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const payload = 'thread-123';

    const expectedThreadDetail = {
      ...(new ThreadDetail({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: new Date().toDateString(),
        username: 'dicoding',
      })),
      comments: [],
    };

    /** creating dependency  of usecase */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: new Date().toDateString(),
        username: 'dicoding',
      })));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** use case instances */
    const getThreadDetail = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetail.execute(payload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(payload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(payload);
  });
});
