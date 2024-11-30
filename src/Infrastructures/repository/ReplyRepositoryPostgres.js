const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createReply(newReply) {
    const {
      threadId, commentId, content, owner,
    } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, createdAt, owner],
    };
    const result = await this._pool.query(query);
    return new CreatedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT 
                        replies.id, 
                        users.username, 
                        replies.created_at as date, 
                        replies.content,
                        replies.deleted_at as deleted_at
                FROM replies
                INNER JOIN users
                    ON replies.owner = users.id
                WHERE replies.comment_id = $1
                ORDER BY replies.created_at ASC`,
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows.map((row) => new Reply({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.content,
      deletedAt: row.deleted_at,
    }));
  }

  async deleteReplyById(replyId, userId) {
    const query = {
      text: 'UPDATE replies SET deleted_at = $1, deleted_by = $2 WHERE id = $3 RETURNING id',
      values: [new Date().toISOString(), userId, replyId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getReplyById(replyId) {
    const query = {
      text: `SELECT 
                        replies.id, 
                        users.username, 
                        replies.created_at as date, 
                        replies.content,
                        replies.deleted_at as deleted_at,
                        replies.owner
                FROM replies
                INNER JOIN users
                ON replies.owner = users.id
                WHERE replies.id = $1`,
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return new Reply({
      id: result.rows[0].id,
      username: result.rows[0].username,
      date: result.rows[0].date,
      content: result.rows[0].content,
      deletedAt: result.rows[0].deleted_at,
      owner: result.rows[0].owner,
    });
  }
}

module.exports = ReplyRepositoryPostgres;
