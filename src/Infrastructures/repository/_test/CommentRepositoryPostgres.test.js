const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
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
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread body', owner: 'user-123', createdAt: new Date() });

            // Action
            await commentRepositoryPostgres.addComment({ newComment, credentialId, threadId:'thread-123'});

            // Assert
            const comment = await CommentTableTestHelper.getCommentById('comment-123');
            expect(comment).toHaveLength(1)
        });
    });

    describe('verifyThreadComment function', () => {
        it('should persist verify available threads and comments', async () => {
            // Arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentTableTestHelper.addComment({});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyThreadComment(threadId, commentId)).resolves.not.toThrowError(NotFoundError);
        })
    });

    describe('verifyCommentOwner function', () => {
        it('should persist verify comment owner', async () => {
            // Arrange
            const userId = 'user-123'
            const commentId = 'comment-123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentTableTestHelper.addComment({});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId)).resolves.not.toThrowError(AuthorizationError);
        })
    })

    describe('DeleteCommentById function', () => {
        it('should persist delete comment', async () => {
            // Arrange
            const commentId = 'comment-123'

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread title', body: 'thread body', owner: 'user-123', createdAt: new Date() });
            await CommentTableTestHelper.addComment({ id: 'comment-123', content: 'thread comment', owner:'user-123', threadId: 'thread-123' });

            // Action
            await commentRepositoryPostgres.deleteCommentById(commentId)

            // Assert
            const succesfullyDeleteComment = await CommentTableTestHelper.getDeletedComment('comment-123');
            expect(succesfullyDeleteComment).toEqual(true)
        })
    })
})