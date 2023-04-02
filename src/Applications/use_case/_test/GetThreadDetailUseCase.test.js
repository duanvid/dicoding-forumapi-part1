const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
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
        createdAt: new Date('2023-01-01').toISOString(),
        username: 'dicoding',
      })),
      comments: [
        {
          id: 'comment-123',
          content: 'thread comment',
          date: new Date('2023-01-01').toISOString(),
          username: 'dicoding',
          replies: [
            {
              id: 'reply-123',
              content: 'comment replies',
              date: new Date('2023-01-01').toISOString(),
              username: 'dicoding',
            },
          ],
        },
        {
          id: 'comment-234',
          content: 'thread comment',
          date: new Date('2023-01-02').toISOString(),
          username: 'riduan',
          replies: [
            {
              id: 'reply-234',
              content: '**balasan telah dihapus**',
              date: new Date('2023-01-02').toISOString(),
              username: 'riduan',
            },
          ],
        },
      ],
    };

    /** creating dependency  of usecase */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        createdAt: new Date('2023-01-01').toISOString(),
        username: 'dicoding',
      })));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          content: 'thread comment',
          date: new Date('2023-01-01').toISOString(),
          username: 'dicoding',
        },
        {
          id: 'comment-234',
          content: 'thread comment',
          date: new Date('2023-01-02').toISOString(),
          username: 'riduan',
        },
      ]));

    mockRepliesRepository.getAllRepliesByCommentId = jest.fn()
      .mockReturnValueOnce([
        {
          id: 'reply-123',
          content: 'comment replies',
          date: new Date('2023-01-01').toISOString(),
          username: 'dicoding',
        },
      ])
      .mockReturnValueOnce([
        {
          id: 'reply-234',
          content: '**balasan telah dihapus**',
          date: new Date('2023-01-02').toISOString(),
          username: 'riduan',
        },
      ]);

    /** use case instances */
    const getThreadDetail = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const threadDetail = await getThreadDetail.execute(payload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(payload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(payload);
    expect(mockRepliesRepository.getAllRepliesByCommentId).toBeCalledTimes(2);
  });
});
