const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
      });

      const credentialId = 'user-123';

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });

      // Action
      await threadRepositoryPostgres.addThread(newThread, credentialId);

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });
  });

  describe('verifyThreadId function', () => {
    it('should throw not found error if threadid not available in database', async () => {
      // Arrange
      const threadId = 'invalid-threatId';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadId(threadId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error if thread id exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread title', body: 'thread body', owner: 'user-123',
      });

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadId(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should persist get saved thread in database', async () => {
      // Arrange
      const payload = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread title', body: 'thread body', owner: 'user-123',
      });

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadById(payload);

      // Assert
      expect(threadDetail).toStrictEqual(new ThreadDetail({
        id: payload,
        title: 'thread title',
        body: 'thread body',
        createdAt: new Date('2023-01-01').toISOString(),
        username: 'dicoding',
      }));
    });
  });
});
