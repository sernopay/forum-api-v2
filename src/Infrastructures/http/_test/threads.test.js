const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const { response } = require('@hapi/hapi/lib/validation');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when request is not authenticated', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is title',
        body: 123,
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is content',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when request is not authenticated', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is content',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when request payload not contain valid thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'test content',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        content: '',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request is not authenticated', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when request payload not contain valid thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus komentar karena thread tidak ditemukan');
    });

    it('should response 404 when request payload not contain valid comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/1`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus komentar karena komentar tidak ditemukan');
    });

    it('should response 403 when comment is not owned by the user', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Register another user
      const anotherUserName = 'dicoding2';
      const anotherPassword = 'secret';
      const anotherUserPayload = {
        username: anotherUserName,
        password: anotherPassword,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: anotherUserPayload,
      });

      // Login to get the authentication token
      const anotherLoginPayload = {
        username: anotherUserName,
        password: anotherPassword,
      };
      const anotherLoginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: anotherLoginPayload,
      });
      const { data: { accessToken: anotherAccessToken } } = JSON.parse(anotherLoginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${anotherAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus komentar karena kamu bukan pemilik komentar');
    });

    it('should response 200 when delete comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and thread detail', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create comments
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentPayload2 = {
        content: 'this is content 2',
      };
      const createCommentResponse2 = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload2,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // delete a comment
      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);
      const createdCommentResponseJSON2 = JSON.parse(createCommentResponse2.payload);
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON2.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // create a reply
      const replyPayload = {
        content: 'this is content',
      };
      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // create another reply
      const replyPayload2 = {
        content: 'this is content 2',
      };

      const createReplyResponse2 = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: replyPayload2,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // delete a reply
      const createdReplyResponseJSON = JSON.parse(createReplyResponse.payload);
      const createdReplyResponseJSON2 = JSON.parse(createReplyResponse2.payload);
      const deleteReplyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies/${createdReplyResponseJSON2.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].content).toEqual('this is content');
      expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(0);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and new reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is content',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 401 when request is not authenticated', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is content',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments/1/replies',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when request payload not contain valid thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'test content',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments/1/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena thread tidak ditemukan');
    });

    it('should response 404 when request payload not contain valid comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is content',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/1/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena komentar tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        content: '',
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when delete reply', async () => {
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Create a reply
      const replyPayload = {
        content: 'this is reply',
      };
      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdReplyResponseJSON = JSON.parse(createReplyResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies/${createdReplyResponseJSON.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request is not authenticated', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1/replies/1',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when request payload not contain valid thread', async () => {
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1/replies/1',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus balasan karena thread tidak ditemukan');
    });

    it('should response 404 when request payload not contain valid comment', async () => {
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/1/replies/1`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus balasan karena komentar tidak ditemukan');
    });

    it('should response 404 when request payload not contain valid reply', async () => {
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies/1`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus balasan karena balasan tidak ditemukan');
    });

    it('should response 403 when reply is not owned by the user', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Create a reply
      const replyPayload = {
        content: 'this is reply',
      };
      const createReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdReplyResponseJSON = JSON.parse(createReplyResponse.payload);

      // Register another user
      const anotherUserName = 'dicoding2';
      const anotherPassword = 'secret';
      const anotherUserPayload = {
        username: anotherUserName,
        password: anotherPassword,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: anotherUserPayload,
      });

      // Login to get the authentication token
      const anotherLoginPayload = {
        username: anotherUserName,
        password: anotherPassword,
      };
      const anotherLoginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: anotherLoginPayload,
      });
      const { data: { accessToken: anotherAccessToken } } = JSON.parse(anotherLoginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/replies/${createdReplyResponseJSON.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${anotherAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus balasan karena kamu bukan pemilik balasan');
    });
  });
  
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {

    it('should response 401 when request is not authenticated', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1/comments/1/likes',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when request payload not contain valid thread', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1/comments/1/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat memberikan like pada komentar karena thread tidak ditemukan');
    })

    it('should response 404 when request payload not contain valid comment', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Register a user
        const userName = 'dicoding';
        const password = 'secret';
        const userPayload = {
          username: userName,
          password,
          fullname: 'Dicoding Indonesia',
        };
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: userPayload,
        });
  
        // Login to get the authentication token
        const loginPayload = {
          username: userName,
          password,
        };
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: loginPayload,
        });
        const { data: { accessToken } } = JSON.parse(loginResponse.payload);
  
        // Create a thread
        const threadPayload = {
          title: 'this is title',
          body: 'this is body',
        };
        const createThreadResponse = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: threadPayload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);
  
        // Action
        const response = await server.inject({
          method: 'PUT',
          url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/1/likes`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        // Assert
        const responseJSON = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJSON.status).toEqual('fail');
        expect(responseJSON.message).toEqual('tidak dapat memberikan like pada komentar karena komentar tidak ditemukan');
    })

    it('should response 200 when like comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
    });

    it('should response 200 when unlike comment', async () => {
      // Arrange
      const server = await createServer(container);

      // Register a user
      const userName = 'dicoding';
      const password = 'secret';
      const userPayload = {
        username: userName,
        password,
        fullname: 'Dicoding Indonesia',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      // Login to get the authentication token
      const loginPayload = {
        username: userName,
        password,
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Create a thread
      const threadPayload = {
        title: 'this is title',
        body: 'this is body',
      };
      const createThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdThreadResponseJSON = JSON.parse(createThreadResponse.payload);

      // Create a comment
      const commentPayload = {
        content: 'this is content',
      };
      const createCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const createdCommentResponseJSON = JSON.parse(createCommentResponse.payload);

      // Like the comment
      await server.inject({
        method: 'PUT',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${createdThreadResponseJSON.data.addedThread.id}/comments/${createdCommentResponseJSON.data.addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');

    });

  }); // end of PUT /threads/{threadId}/comments/{commentId}/likes
});
