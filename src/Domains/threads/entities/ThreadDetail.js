class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, body, createdAt, username,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = createdAt;
    this.username = username;
  }

  _verifyPayload({
    id, title, body, createdAt, username,
  }) {
    if (!id || !title || !body || !createdAt || !username) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof createdAt !== 'string' || typeof username !== 'string') {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadDetail;
