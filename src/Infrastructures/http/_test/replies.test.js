const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies end point', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and return persisted replies', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment replies',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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

    it('should repsonse 400 if request not contain required payload', async () => {
      // Arrange
      const requestPayload = {
        invalidPayload: 'invalid payload',
      };
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat menambahkan balasan, payload tidak valid');
    });

    it('should repsonse 400 if request payload not contain correct data type', async () => {
      // Arrange
      const requestPayload = {
        content: ['invalid payload data type'],
      };
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat menambahkan balasan, tipe data tidak valid');
    });

    it('should response 401 if request not contain or have invalid access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment replies',
      };
      const server = await createServer(container);
      const accessToken = 'invalid access token';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(response.statusMessage).toEqual('Unauthorized');
    });

    it('should response 404 when request not contain available thread or comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment replies',
      };

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();
      const threadId = 'invalid threadId';
      const commentId = 'invalid commentId';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread atau Komentar tidak ditemukan');
    });
  });

  describe('when DELETE threads/{threadsId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and orchestrating delete comment correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReplies({});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('Berhasil menghapus balasan');
    });
  });
});
