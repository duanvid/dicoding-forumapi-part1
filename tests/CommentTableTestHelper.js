/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool")

const CommentTableTestHelper = {
    async addComment({
        id = 'comment-123',
        content = 'thread comment',
        owner = 'user-123',
        threadId = 'thread-123',
        created_at = new Date()
    }) {
        await pool.query({
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, owner, false, threadId, created_at]
        })
    },

    async getCommentById(id) {
        const query = {
            text: 'SELECT FROM comments WHERE id=$1',
            values: [id]
        }

        const result = await pool.query(query)
        return result.rows;
    },

    async getDeletedComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id]
        }

        const result = await pool.query(query);
        return result.rows[0].is_delete
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    }
}

module.exports = CommentTableTestHelper;
