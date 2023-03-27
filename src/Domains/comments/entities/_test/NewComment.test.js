const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain correct data type', () => {
    // Arrange
    const payload = {
      content: 12345,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'new comment',
    };

    // Action
    const { content } = new NewComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
