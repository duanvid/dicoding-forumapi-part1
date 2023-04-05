const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  let commentRepositoryPostgres;

  beforeEach(() => {
    commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function orchestration', () => {
    it('should persist add comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'thread comment',
      });

      const credentialId = 'user-123';
      const fakeIdGenerator = () => '123';
      commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const addedComment = await commentRepositoryPostgres.addComment({ newComment, credentialId, threadId: 'thread-123' });

      // Assert
      const comment = await CommentTableTestHelper.getCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'thread comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadComment function', () => {
    it('should not throw NotFoundError if comment and thread are valid', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyThreadComment(threadId, commentId))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError if commentId not available', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      /** menambahkan komentar dengan id: comment-234 */
      await CommentTableTestHelper.addComment({ id: 'comment-234' });

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyThreadComment(threadId, commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if threadhId not available', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});

      /** menambahkan thread dengan id: thread-234 & menulis balasan pada thread tersebut */
      await ThreadsTableTestHelper.addThread({ id: 'thread-234' });
      await CommentTableTestHelper.addComment({ threadId: 'thread-234' });

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyThreadComment(threadId, commentId))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should persist verify comment owner', async () => {
      // Arrange
      const userId = 'user-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizatitonError if request owner not equal comment owner', async () => {
      // Arrange
      const userId = 'user-123';
      const commentId = 'comment-123';

      /** menambahkan user dicoding dengan id: user-234 */
      await UsersTableTestHelper.addUser({ id: 'user-234' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-234' });
      await CommentTableTestHelper.addComment({ owner: 'user-234' });

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .rejects.toThrow(AuthorizationError);
    });
  });

  describe('DeleteCommentById function', () => {
    it('should persist delete comment', async () => {
      // Arrange
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const succesfullyDeleteComment = await CommentTableTestHelper.getDeletedComment('comment-123');
      expect(succesfullyDeleteComment).toStrictEqual(true);
    });
  });

  describe('getAllCommentsByThreadsId function', () => {
    it('should orchestrating get all comments function correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const expectedThreadComments = [
        new CommentDetails({
          id: 'comment-123',
          username: 'dicoding',
          createdAt: new Date('2023-01-01').toISOString(),
          content: 'thread comment',
          isDelete: false,
        }),
        new CommentDetails({
          id: 'comment-234',
          username: 'dicoding',
          createdAt: new Date('2023-01-02').toISOString(),
          content: 'deleted thread comment',
          isDelete: true,
        }),
      ];
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({ createdAt: new Date('2023-01-01').toISOString() });
      await CommentTableTestHelper.addComment({
        id: 'comment-234', content: 'deleted thread comment', createdAt: new Date('2023-01-02').toISOString(), isDelete: true,
      });

      // Action
      const comments = await commentRepositoryPostgres.getAllCommentsByThreadId(threadId);

      // Assert
      expect(comments).toStrictEqual(expectedThreadComments);
    });
  });
});
