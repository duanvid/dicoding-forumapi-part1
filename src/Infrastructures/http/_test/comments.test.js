const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/threads/{threadId}/comments end point', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                content: 'thread comment'
            };
            const threadId = 'thread-123'
            await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread title', body: 'thread body', owner: 'user-123' });
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });

        it('should response 404 when request not contain available thread in database', async () => {
            // Arrange
            const requestPayload = {
                content: 'thread comment'
            };
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread title', body: 'thread body', owner: 'user-123' });
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = 'invalid-threadId';

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                invalidContent: 'invalid payload content'
            };
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread title', body: 'thread body', owner: 'user-123' });
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = 'thread-123';

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Tidak dapat menambahkan komentar, Payload content tidak valid');
        });

        it('should response 400 when request payload not contain correct data type', async () => {
            // Arrange
            const requestPayload = {
                content: ['thread comment in array format']
            }
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread title', body: 'thread body', owner: 'user-123' });
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = 'thread-123';

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Tidak dapat menambahkan komentar, tipe data komentar tidak sesuai');
        })
    })
})