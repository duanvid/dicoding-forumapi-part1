const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewReplies = require('../../../Domains/replies/entities/NewReplies');
const pool = require('../../database/postgres/pool');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');

describe('RepliesRepositoryPostgres', () => {
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
    it('should persist add replies to comment', async () => {
      // Arrange
      const newReplies = new NewReplies({
        content: 'comment replies',
      });

      const credentialId = 'user-123';
      const fakeIdGenerator = () => '123';
      const commentId = 'comment-123';

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      await repliesRepositoryPostgres.addReplies({ newReplies, credentialId, commentId });

      // Assert
      const addedReplies = await RepliesTableTestHelper.getRepliesById('reply-123');
      expect(addedReplies).toHaveLength(1);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should persist verify reply owner', async () => {
      // Arrange
      const userId = 'user-123';
      const replyId = 'reply-123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action and Assert
      await expect(repliesRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw Authorizationerror if not the owner', async () => {
      // Arrange
      const userId = 'user-234';
      const replyId = 'reply-123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
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
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action
      await repliesRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const succesfullyDeleteReply = await RepliesTableTestHelper.getDeletedReply('reply-123');
      expect(succesfullyDeleteReply).toEqual(true);
    });
  });

  describe('verifyCommentReplies function', () => {
    it('should persist verify comment replies action correctly', async () => {
      // Arrange
      const replyId = 'reply-123';
      const commentId = 'comment-123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

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
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

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
      const commentId = 'comment-123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
      const expectedCommentReplies = [
        {
          id: 'reply-123',
          content: 'comment replies',
          date: new Date('2023-01-01').toISOString(),
          username: 'dicoding',
        },
      ];

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({ createdAt: new Date('2023-01-01').toISOString() });

      // Action
      const replies = await repliesRepositoryPostgres.getAllRepliesByCommentId(commentId);

      // Assert
      expect(replies).toEqual(expectedCommentReplies);
    });
  });
});
