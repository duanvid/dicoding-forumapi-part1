const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
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
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
      });

      const credentialId = 'user-123';

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      /** menambahkan user dengan id: user-123, username: dicoding */
      await UsersTableTestHelper.addUser({});

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadId function', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

    it('should throw not found error if threadid not available in database', async () => {
      // Arrange
      const threadId = 'invalid-threatId';

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadId(threadId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error if thread id exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

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

      /** menambahkan user dengan id: user-123 dan thread dengan id: thread-123 */
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ createdAt: new Date('2023-01-01').toISOString() });

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
