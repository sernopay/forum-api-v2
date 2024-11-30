const LikeRepository = require('../../Domains/likes/LikeRepository');
const Like = require('../../Domains/likes/entities/Like');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getLikeByCommentIdAnduserId(commentId, userId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      return null;
    }
    return new Like({
      id: result.rows[0].id,
      commentId: result.rows[0].comment_id,
      userId: result.rows[0].user_id,
    });
  }

  async createLike(commentId, userId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND user_id = $2 RETURNING id',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async countLikeByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(comment_id) FROM likes WHERE comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = LikeRepositoryPostgres;
