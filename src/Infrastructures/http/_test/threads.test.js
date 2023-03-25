const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require('../createServer')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'thread title',
                body: 'thread body',
            };
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken()

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },

            });

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined()
        });

        it('should response 401 if request not contain or have invalid access token', async () => {
            // Arrange
            const requestPayload = {
                title: 'thread title',
                body: 'thread body'
            }
            const server = await createServer(container);
            const accessToken = 'invalid accsess token';

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            expect(response.statusCode).toEqual(401);
            expect(response.statusMessage).toEqual('Unauthorized');
        })

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'thread title without body'
            };
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambahkan threads karena properti yg dibutuhkan tidak ada')
        })

        it('should response 400 when request payload not contain correct data type', async () => {
            // Arrange
            const requestPayload = {
                title: ['thread title'],
                body: true
            }
            const server = await createServer(container)
            const accessToken = await ServerTestHelper.getAccessToken()

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambahkan threads, tipe data tidak valid')
        })
    })
})