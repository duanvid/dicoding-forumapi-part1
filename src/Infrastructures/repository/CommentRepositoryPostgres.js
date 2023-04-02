const { mapThreadComments } = require('../../Commons/utils');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({ newComment, credentialId, threadId }) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const isDelete = false;
    const createdAt = new Date();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, credentialId, isDelete, threadId, createdAt],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyThreadId(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async verifyThreadComment(threadId, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread atau Komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Tidak dapat menghapus komentar, pengguna tidak cocok dengan pemilik komentar');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getAllCommentsByThreadId(threadId) {
    const query = {
      text: `
              SELECT
                comments.id,
                username,
                created_at,
                content,
                is_delete
              FROM
                comments
              LEFT JOIN
                users
              ON
                users.id = comments.owner
              WHERE
                thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const rawComments = result.rows.map(mapThreadComments);
    const comments = rawComments.map((comment) => new CommentDetails(comment));
    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
