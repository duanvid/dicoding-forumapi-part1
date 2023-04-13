class ReplyDetails {
  constructor(payload) {
    console.log(payload);
    this._verifyPayload(payload);
    const {
      id, content, createdAt, isDelete, username, commentId,
    } = payload;
    this.id = id;
    this.date = createdAt;
    this.username = username;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.commentId = commentId;
  }

  _verifyPayload({
    id, content, createdAt, isDelete, username, commentId,
  }) {
    if (!id || !content || !createdAt || !username || isDelete === undefined || !commentId) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof createdAt !== 'string' || typeof isDelete !== 'boolean' || typeof username !== 'string') {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ReplyDetails;
