const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('should persist new thread and return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'title',
        body: 'body',
        owner: 'owner',
      });

      const expectedCreatedThread = new CreatedThread({
        id: 'thread-123',
        title: 'title',
        owner: 'owner',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.createThread(createThread);
      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');

      // Assert
      expect(createdThread).toBeDefined();
      expect(createdThread).toStrictEqual(expectedCreatedThread);
      expect(createdThread.id).toBe('thread-123');
      expect(createdThread.title).toBe(createThread.title);
      expect(createdThread.owner).toBe(createThread.owner);

      expect(threads).toHaveLength(1);
      expect(threads[0].title).toBe(createThread.title);
      expect(threads[0].owner).toBe(createThread.owner);
      expect(threads[0].id).toBe('thread-123');
    });
  });

  describe('isThreadExist function', () => {
    it('should check if returned thread isExist', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'title',
        body: 'body',
        owner: 'owner',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.createThread(createThread);

      // Action
      const isExist = await threadRepositoryPostgres.isThreadExist('thread-123');

      // Assert
      expect(isExist).toBe(1);
    });
    it('should check if returned thread is not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const isExist = await threadRepositoryPostgres.isThreadExist('thread-123');

      // Assert
      expect(isExist).toBe(0);
    });
  });

  describe('getThreadById function', () => {
    it('should return created thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const createThread = new CreateThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.createThread(createThread);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      const expectedThreadDetail = new ThreadDetail({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'dicoding',
        date: thread.date,
      });

      // Assert
      expect(thread).toBeDefined();
      expect(thread).toStrictEqual(expectedThreadDetail);
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe(createThread.title);
      expect(thread.body).toBe(createThread.body);
      expect(thread.username).toBe('dicoding');
      expect(thread.date).toBeDefined();
    });

    it('should return null if thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toBe(null);
    });
  });
});
