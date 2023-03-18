class CommentRepository {
    async addComment(payload, credentialId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    };
    async verifyThreadId(threadId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    };
}

module.exports = CommentRepository