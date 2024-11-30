const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const CommentInThread = require('../../../Domains/comments/entities/CommentInThread');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createComment function', () => {
    it('should persist new comment and return created comment correctly', async () => {
      // Arrange
      const newComment = {
        threadId: 'thread-123',
        content: 'content',
        owner: 'owner',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const expectedCreatedComment = new CreatedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'owner',
      });

      // Action
      const createdComment = await commentRepositoryPostgres.createComment(newComment);

      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(createdComment).toBeDefined();
      expect(createdComment).toStrictEqual(expectedCreatedComment);
      expect(createdComment.id).toBe('comment-123');
      expect(createdComment.content).toBe(newComment.content);
      expect(createdComment.owner).toBe(newComment.owner);

      expect(comment).toBeDefined();
      expect(comment.id).toBe('comment-123');
      expect(comment.threadId).toBe(newComment.threadId);
      expect(comment.content).toBe(newComment.content);
      expect(comment.createdAt).toBeDefined();
      expect(comment.owner).toBe(newComment.owner);
      expect(comment.deletedAt).toBeNull();
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      const newComment = {
        threadId: 'thread-123',
        content: 'content',
        owner: 'owner',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const createdComment = await commentRepositoryPostgres.createComment(newComment);

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(createdComment.id);

      const expectedComment = new Comment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'content',
        owner: 'owner',
        createdAt: comment.createdAt,
        deletedAt: null,
      });

      // Assert
      expect(comment).toBeDefined();
      expect(comment).toStrictEqual(expectedComment);
      expect(comment.id).toBe(createdComment.id);
      expect(comment.threadId).toBe(newComment.threadId);
      expect(comment.content).toBe(newComment.content);
      expect(comment.createdAt).toBeDefined();
      expect(comment.owner).toBe(newComment.owner);
    });

    it('should return null if comment not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toBeNull();
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      const newComment = {
        threadId: 'thread-123',
        content: 'content',
        owner: 'owner',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const createdComment = await commentRepositoryPostgres.createComment(newComment);

      // Action
      await commentRepositoryPostgres.deleteCommentById(createdComment.id, newComment.owner);

      // Assert
      const comment = await commentRepositoryPostgres.getCommentById(createdComment.id);
      expect(comment.deletedAt).toBeDefined();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const newComment = {
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.createComment(newComment);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(newComment.threadId);

      const expectedCommentInThread = new CommentInThread({
        id: 'comment-123',
        username: 'dicoding',
        date: comments[0].date,
        content: 'content',
        deletedAt: null,
      });

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual(expectedCommentInThread);
      expect(comments[0]).toBeDefined();
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBe('dicoding');
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBe(newComment.content);
      expect(comments[0].deletedAt).toBeNull();
    });
  });
});
