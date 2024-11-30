const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createReply function', () => {
    it('should persist new reply and return created reply correctly', async () => {
      // Arrange
      const newReply = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'content',
        owner: 'owner',
      };

      const expectedCreatedReply = new CreatedReply({
        id: 'reply-123',
        content: 'content',
        owner: 'owner',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await replyRepositoryPostgres.createReply(newReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');

      // Assert
      expect(createdReply).toBeDefined();
      expect(createdReply).toStrictEqual(expectedCreatedReply);
      expect(createdReply.id).toBe('reply-123');
      expect(createdReply.content).toBe(newReply.content);
      expect(createdReply.owner).toBe(newReply.owner);

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toBe('reply-123');
      expect(replies[0].thread_id).toBe(newReply.threadId);
      expect(replies[0].comment_id).toBe(newReply.commentId);
      expect(replies[0].content).toBe(newReply.content);
      expect(replies[0].created_at).toBeDefined();
      expect(replies[0].owner).toBe(newReply.owner);
      expect(replies[0].deleted_at).toBeNull();
      expect(replies[0].deleted_by).toBeNull();
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const newReply = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'content',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.createReply(newReply);

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(newReply.commentId);

      const expectedReply = new Reply({
        id: 'reply-123',
        username: 'dicoding',
        content: newReply.content,
        deletedAt: null,
        date: replies[0].date,
      });

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual(expectedReply);
      expect(replies[0].id).toBe('reply-123');
      expect(replies[0].username).toBe('dicoding');
      expect(replies[0].date).toBeDefined();
      expect(replies[0].content).toBe(newReply.content);
      expect(replies[0].deletedAt).toBeNull();
    });

    it('should return empty array when no replies in database', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toHaveLength(0);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const newReply = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'content',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const createdReply = await replyRepositoryPostgres.createReply(newReply);

      // Action
      await replyRepositoryPostgres.deleteReplyById(createdReply.id, newReply.owner);

      // Assert
      const reply = await replyRepositoryPostgres.getReplyById(createdReply.id);
      expect(reply.deletedAt).toBeDefined();
    });
  });

  describe('getReplyById function', () => {
    it('should return reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const newReply = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'content',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const createdReply = await replyRepositoryPostgres.createReply(newReply);

      // Action
      const reply = await replyRepositoryPostgres.getReplyById(createdReply.id);

      const expectedReply = new Reply({
        id: 'reply-123',
        username: 'dicoding',
        date: reply.date,
        content: newReply.content,
        deletedAt: null,
        owner: newReply.owner,
      });

      // Assert
      expect(reply).toBeDefined();
      expect(reply).toStrictEqual(expectedReply);
      expect(reply.id).toBe('reply-123');
      expect(reply.username).toBe('dicoding');
      expect(reply.date).toBeDefined();
      expect(reply.content).toBe(newReply.content);
      expect(reply.deletedAt).toBeNull();
      expect(reply.owner).toBe(newReply.owner);
    });

    it('should return null when reply is not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const reply = await replyRepositoryPostgres.getReplyById('reply-123');

      // Assert
      expect(reply).toBeNull();
    });
  });
});
