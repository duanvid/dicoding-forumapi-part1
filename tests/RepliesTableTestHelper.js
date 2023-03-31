/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplies({
    id = 'reply-123',
    content = 'comment replies',
    owner = 'user-123',
    createdAt = new Date('2023-01-01').toISOString(),
    commentId = 'comment-123',
    isDelete = false,
  }) {
    await pool.query({
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, createdAt, commentId, isDelete],
    });
  },
  async getRepliesById(id) {
    const query = {
      text: 'SELECT FROM replies WHERE id=$1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async getDeletedReply(replyId) {
    const query = {
      text: 'SELECT is_delete FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await pool.query(query);
    return result.rows[0].is_delete;
  },
};

module.exports = RepliesTableTestHelper;
