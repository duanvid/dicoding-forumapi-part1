const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentTableTestHelper.cleanTable()
    });

    afterAll(async () => {
        await pool.end()
    });

    describe('addComment function orchestration', () => {
        it('should persist add comment', async () => {
            // Arrange
            const newComment = new NewComment({
                content: 'thread comment',
            })

            const credentialId = 'user-123';
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.addComment(newComment, credentialId);

            // Assert
            const comment = await CommentTableTestHelper.getCommentById('comment-123');
            expect(comment).toHaveLength(1)
        });
    })
})