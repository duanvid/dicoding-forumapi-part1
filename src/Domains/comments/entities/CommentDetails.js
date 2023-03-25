class CommentDetails {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, username, created_at, content } = payload

        this.id = id;
        this.username = username;
        this.date = created_at;
        this.content = content;
    }

    _verifyPayload({ id, username, created_at, content }) {
        if (!id || !username || !created_at || !content) {
            throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
        }
        if (typeof id !== 'string' || typeof username !== 'string' || typeof created_at !== 'string' || typeof content !== 'string') {
            throw new Error('COMMENT_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
        }
    }
}

module.exports = CommentDetails;