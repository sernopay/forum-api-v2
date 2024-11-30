const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const Comment = require('../../Domains/comments/entities/Comment');
const CommentInThread = require('../../Domains/comments/entities/CommentInThread');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, createdAt, owner],
    };
    const result = await this._pool.query(query);
    return new CreatedComment({ ...result.rows[0] });
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT id, thread_id, content, created_at, owner, deleted_at, deleted_by FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return new Comment({
      id: result.rows[0].id,
      threadId: result.rows[0].thread_id,
      content: result.rows[0].content,
      createdAt: result.rows[0].created_at,
      owner: result.rows[0].owner,
      deletedAt: result.rows[0].deleted_at,
    });
  }

  async deleteCommentById(commentId, userId) {
    const query = {
      text: 'UPDATE comments SET deleted_at = $1, deleted_by = $2 WHERE id = $3 RETURNING id',
      values: [new Date().toISOString(), userId, commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT 
                        comments.id, 
                        users.username, 
                        comments.created_at as date, 
                        comments.content,
                        comments.deleted_at as deleted_at
                FROM comments
                INNER JOIN users
                    ON comments.owner = users.id
                WHERE comments.thread_id = $1
                ORDER BY comments.created_at ASC
                `,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(
      (comment) => new CommentInThread({ ...comment, deletedAt: comment.deleted_at }),
    );
  }
}

module.exports = CommentRepositoryPostgres;
