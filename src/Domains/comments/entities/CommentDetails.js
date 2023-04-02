class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, createdAt, content, isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = createdAt;

    if (isDelete) {
      this.content = '**komentar telah dihapus**';
    } else {
      this.content = content;
    }
  }

  _verifyPayload({
    id, username, createdAt, content, isDelete,
  }) {
    if (!id || !username || !createdAt || !content || isDelete === undefined) {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof username !== 'string' || typeof createdAt !== 'string' || typeof content !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = CommentDetails;
