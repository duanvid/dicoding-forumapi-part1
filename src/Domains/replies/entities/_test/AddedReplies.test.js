const AddedReplies = require('../AddedReplies');

describe('AddedReplies entities', () => {
  it('should throw error if payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not contain correct data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'comment replies',
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new AddedReplies(payload)).toThrowError('');
  });

  it('should create addedReplies Object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'comment replies',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedReplies(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
