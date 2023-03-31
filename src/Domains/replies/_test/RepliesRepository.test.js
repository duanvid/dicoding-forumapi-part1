const RepliesRepository = require('../RepliesRepository');

describe('RepliesRepository interfaces', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const repliesRepository = new RepliesRepository();

    // Action & Assert
    await expect(repliesRepository.addReplies({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.getAllRepliesByCommentId('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.deleteReplyById('')).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.verifyCommentReplies({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
