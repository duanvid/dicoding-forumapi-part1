class NewReplies {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content } = payload;

    this.content = content;
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string') {
      throw new Error('NEW_REPLIES.NOT_CONTAIN_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = NewReplies;
