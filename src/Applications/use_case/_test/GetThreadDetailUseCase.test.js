const CommentRepository = require('../../../Domains/comments/CommentRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/replies/entities/ReplyDetails');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const payload = 'thread-123';
    const expectedThreadComments = [
      new CommentDetails({
        id: 'comment-123',
        content: 'thread comment',
        createdAt: new Date('2023-01-01').toISOString(),
        username: 'dicoding',
        isDelete: false,
      }),
      new CommentDetails({
        id: 'comment-234',
        content: 'thread comment',
        createdAt: new Date('2023-01-02').toISOString(),
        username: 'riduan',
        isDelete: false,
      }),
    ];

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
            new ReplyDetails({
              id: 'reply-123',
              content: 'comment replies',
              createdAt: new Date('2023-01-01').toISOString(),
              username: 'dicoding',
              isDelete: false,
              commentId: 'comment-123',
            }),
          ],
        },
        {
          id: 'comment-234',
          content: 'thread comment',
          date: new Date('2023-01-02').toISOString(),
          username: 'riduan',
          replies: [
            new ReplyDetails({
              id: 'reply-234',
              content: 'deleted replies',
              createdAt: new Date('2023-01-02').toISOString(),
              username: 'riduan',
              isDelete: true,
              commentId: 'comment-234',
            }),
          ],
        },
      ],
    };

    /** creating dependency  of usecase */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new ThreadDetail({
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      createdAt: new Date('2023-01-01').toISOString(),
      username: 'dicoding',
    })));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise
      .resolve(expectedThreadComments));

    mockRepliesRepository.getAllRepliesByThreadId = jest.fn(() => Promise.resolve([
      new ReplyDetails({
        id: 'reply-123',
        content: 'comment replies',
        createdAt: new Date('2023-01-01').toISOString(),
        username: 'dicoding',
        isDelete: false,
        commentId: 'comment-123',
      }),
      new ReplyDetails({
        id: 'reply-234',
        content: 'deleted replies',
        createdAt: new Date('2023-01-02').toISOString(),
        username: 'riduan',
        isDelete: true,
        commentId: 'comment-234',
      }),
    ]));

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
    expect(mockCommentRepository.getAllCommentsByThreadId).toBeCalledWith(payload);
    expect(mockRepliesRepository.getAllRepliesByThreadId).toBeCalledWith(payload);
  });
});
