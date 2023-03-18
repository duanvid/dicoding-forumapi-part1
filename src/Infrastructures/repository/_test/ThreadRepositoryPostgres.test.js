const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const NewThread = require("../../../Domains/threads/entities/NewThread")
const pool = require("../../database/postgres/pool")
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist add thread', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'thread title',
                body: 'thread body'
            });

            const credentialId = 'user-123';

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(newThread, credentialId)

            // Assert
            const thread = await ThreadsTableTestHelper.getThreadById('thread-123')
            expect(thread).toHaveLength(1)
        })
    })

    describe('verifyThreadId function', () => {
        it('should throw not found error if threadid not available in database', async () => {
            // Arrange
            const threadId = 'invalid-threatId';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadId(threadId)).rejects.toThrowError(NotFoundError)
        })

        it('should not throw error if thread id exist', async () => {
            // Arrange
            const threadId = 'thread-123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread title', body: 'thread body', owner: 'user-123'})

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadId(threadId)).resolves.not.toThrowError(NotFoundError)

        })
    })
})