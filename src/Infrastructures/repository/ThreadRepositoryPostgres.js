const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, new Date().toISOString()],
    };
    const result = await this._pool.query(query);
    return new CreatedThread({ ...result.rows[0] });
  }

  async isThreadExist(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, users.username, threads.created_at as date 
                FROM threads 
                INNER JOIN users 
                    ON threads.owner = users.id 
                WHERE threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return new ThreadDetail({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
