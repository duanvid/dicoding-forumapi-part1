/* istanbul ignore file */

const hapiAuthJwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(payload);
    return hapiAuthJwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
