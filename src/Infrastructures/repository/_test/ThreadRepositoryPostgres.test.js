const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
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
})