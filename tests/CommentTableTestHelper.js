/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool")

const CommentTableTestHelper = {
    async addComment({
        id = 'comment-123',
        content = 'thread comment',
        owner = 'user-123',
    }) {
        await pool.query({
            text: 'INSERT INTO comments VALUES($1, $2, $3)',
            values: [id, content, owner]
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

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments');
    }
}

module.exports = CommentTableTestHelper;
