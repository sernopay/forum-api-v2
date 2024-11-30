/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async cleanTable() {
        await pool.query('delete from replies where 1=1');
    },
    
    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };
        
        const result = await pool.query(query);
        return result.rows;
    },
};

module.exports = RepliesTableTestHelper;