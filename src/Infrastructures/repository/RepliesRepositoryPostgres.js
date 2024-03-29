const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReplies = require('../../Domains/replies/entities/AddedReplies');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');
const RepliesRepository = require('../../Domains/replies/RepliesRepository');

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReplies({ newReplies, credentialId, commentId }) {
    const { content } = newReplies;
    const id = `reply-${this._idGenerator()}`;
    const isDelete = false;
    const createdAt = new Date();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, credentialId, createdAt, commentId, isDelete],
    };

    const result = await this._pool.query(query);
    return new AddedReplies({ ...result.rows[0] });
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Tidak dapat menghapus balasan, anda tidak diberi otorisasi');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async verifyCommentReplies(commentId, replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar atau balasan tidak ditemukan');
    }
  }

  async getAllRepliesByThreadId(threadhId) {
    const query = {
      text: `
              SELECT
                replies.id,
                replies.content,
                replies.created_at as "createdAt",
                replies.is_delete as "isDelete",
                username,
                replies.comment_id as "commentId"
              FROM
                threads
                JOIN comments ON threads.id = comments.thread_id
                JOIN replies ON comments.id = replies.comment_id
                JOIN users ON users.id = replies.owner
              WHERE
                threads.id = $1
              ORDER BY
                replies.created_at
              ASC`,
      values: [threadhId],
    };

    const result = await this._pool.query(query);
    const replies = result.rows.map((reply) => new ReplyDetails(reply));
    return replies;
  }
}

module.exports = RepliesRepositoryPostgres;
