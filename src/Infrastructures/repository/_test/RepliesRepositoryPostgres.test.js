const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies');
const NewReplies = require('../../../Domains/replies/entities/NewReplies');
const ReplyDetails = require('../../../Domains/replies/entities/ReplyDetails');
const pool = require('../../database/postgres/pool');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');

describe('RepliesRepositoryPostgres', () => {
  let repliesRepositoryPostgres;

  beforeEach(() => {
    repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReplies function orchestration', () => {
    it('should persist add replies to comment and return added reply correctly', async () => {
      // Arrange
      const newReplies = new NewReplies({
        content: 'comment replies',
      });

      const credentialId = 'user-123';
      const fakeIdGenerator = () => '123';
      const commentId = 'comment-123';

      repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      const addedReplies = await repliesRepositoryPostgres.addReplies({
        newReplies, credentialId, commentId,
      });

      // Assert
      const replies = await RepliesTableTestHelper.getRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReplies).toStrictEqual(new AddedReplies({
        id: 'reply-123',
        content: 'comment replies',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not throw AuthorizationError if request owner equal to reply owner', async () => {
      // Arrange
      const userId = 'user-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw Authorizationerror if request owner not equal reply owner', async () => {
      // Arrange
      const userId = 'user-234';
      const replyId = 'reply-123';

      /** menambahkan data sebagai user-123 */
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should persist delete reply action corectly', async () => {
      // Arrange
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action
      await repliesRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const succesfullyDeleteReply = await RepliesTableTestHelper.getDeletedReply('reply-123');
      expect(succesfullyDeleteReply).toStrictEqual(true);
    });
  });

  describe('verifyCommentReplies function', () => {
    it('should not throw NotFoundError if comment and replies available', async () => {
      // Arrange
      const replyId = 'reply-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyCommentReplies(commentId, replyId))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw not found error if reply id not match with database', async () => {
      // Arrange
      const replyId = 'reply-234';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyCommentReplies(commentId, replyId))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw not found error if comment id not match with database', async () => {
      // Arrange
      const replyId = 'reply-123';
      const commentId = 'comment-234';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyCommentReplies(commentId, replyId))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getAllRepliesByCommentId function', () => {
    it('should orchestrating get all replies function correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const expectedCommentReplies = [
        new ReplyDetails({
          id: 'reply-123',
          content: 'comment replies',
          createdAt: new Date('2023-01-01').toISOString(),
          username: 'dicoding',
          isDelete: false,
          commentId: 'comment-123',
        }),
      ];

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({ createdAt: new Date('2023-01-01').toISOString() });

      // Action
      const replies = await repliesRepositoryPostgres.getAllRepliesByThreadId(threadId);

      // Assert
      expect(replies).toStrictEqual(expectedCommentReplies);
    });
  });
});
