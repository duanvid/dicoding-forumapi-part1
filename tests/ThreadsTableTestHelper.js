/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123',
        title = 'thread title',
        body = 'thread body',
        owner = 'user-123',
    }) {
        await pool.query({
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
            values: [id, title, body, owner]
        })
    },

    async getThreadById(id) {
        const query = {
            text: 'SELECT FROM threads WHERE id=$1',
            values: [id]
        }

        const result = await pool.query(query);
        return result.rows;

    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE threads')
    }
}

module.exports = ThreadsTableTestHelper;