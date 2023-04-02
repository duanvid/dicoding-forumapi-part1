const { mapThread } = require('../../Commons/utils');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload, credentialId) {
    const { title, body } = payload;
    const createdAt = new Date();
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, credentialId, createdAt],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM threads where id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `
            SELECT
                threads.id,
                title,
                body,
                username,
                created_at
            FROM
                threads
            LEFT JOIN
                users
            ON
                users.id = owner
            WHERE
                threads.id = $1
            `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const thread = result.rows.map(mapThread);
    return new ThreadDetail({ ...thread[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
