const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments end point', () => {
  let server;
  let accessToken;

  beforeAll(async () => {
    server = await createServer(container);
  });

  beforeEach(async () => {
    accessToken = await ServerTestHelper.getAccessToken();
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and return persisted thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'thread comment',
      };
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        invalidContent: 'invalid payload content',
      };

      await ThreadsTableTestHelper.addThread({});
      const threadId = 'thread-123';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat menambahkan komentar, Payload content tidak valid');
    });

    it('should response 400 when request payload not contain correct data type', async () => {
      // Arrange
      const requestPayload = {
        content: ['thread comment in array format'],
      };
      await ThreadsTableTestHelper.addThread({});
      const threadId = 'thread-123';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat menambahkan komentar, tipe data komentar tidak sesuai');
    });

    it('should response 401 if request not contain or have invalid access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'thread comment',
      };
      const threadId = 'thread-123';
      const invalidAccessToken = 'invalid access token';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${invalidAccessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(response.statusMessage).toEqual('Unauthorized');
    });

    it('should response 404 when request not contain available thread in database', async () => {
      // Arrange
      const requestPayload = {
        content: 'thread comment',
      };
      await ThreadsTableTestHelper.addThread({});
      const threadId = 'invalid-threadId';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and orchestrating delete comment correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('Berhasil menghapus komentar');
    });

    it('should response 404 if parameter not contain correct threadId or commentId', async () => {
      // Arrange
      const threadId = 'thread-234';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 403 if request not contain correct owner', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({});

      /** menambahkan komentar baru dengan user riduan, id: user-234 */
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'riduan' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', owner: 'user-234' });

      // Action
      /** menghapus catatan  dengan user dicoding, id: user-123 */
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(403);
    });
  });
});
