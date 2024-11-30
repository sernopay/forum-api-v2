/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeTableTestHelper = {
    async addLike({
        id = 'like-123', commentId = 'comment-123', userId = 'user-123'
    }) {
        const query = {
            text: 'INSERT INTO likes values($1, $2, $3)',
            values: [id, commentId, userId],
        };
        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes where 1=1');
    },
}

module.exports = LikeTableTestHelper;