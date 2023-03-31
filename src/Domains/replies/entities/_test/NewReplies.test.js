const NewReplies = require('../NewReplies');

describe('NewReplies entities', () => {
  it('should throw error when payload not contain correct property', () => {
    // Arrange
    const payload = {
      invalidProperty: 'invalid property',
    };

    // Action & Assert
    expect(() => new NewReplies(payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not contain correct data type', () => {
    // Arrange
    const payload = {
      content: ['comment replies'],
    };

    // Action & Assert
    expect(() => new NewReplies(payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create newReplies object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment replies',
    };

    // Action
    const { content } = new NewReplies(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
