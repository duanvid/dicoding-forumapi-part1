const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(payload, credentialId) {
        const { content } = payload;
        const id = `comment-${this._idGenerator()}`
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3) RETURNING id, content, owner',
            values: [id, content, credentialId]
        }

        const result = await this._pool.query(query)
        return new AddedComment({...result.rows[0]})
    }

    async verifyThreadId(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId]
        }

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Thread tidak ditemukan')
        }
    }
}

module.exports = CommentRepositoryPostgres;