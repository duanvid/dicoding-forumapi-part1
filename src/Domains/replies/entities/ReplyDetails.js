class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, createdAt, isDelete, username,
    } = payload;
    this.id = id;
    this.date = createdAt;
    this.username = username;

    if (isDelete) {
      this.content = '**balasan telah dihapus**';
    } else {
      this.content = content;
    }
  }

  _verifyPayload({
    id, content, createdAt, isDelete, username,
  }) {
    if (!id || !content || !createdAt || !username || isDelete === undefined) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof createdAt !== 'string' || typeof isDelete !== 'boolean' || typeof username !== 'string') {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ReplyDetails;
