const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'thread comment',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload dit not contain correct datatype', () => {
    // Arrange
    const payload = {
      id: 123,
      content: ['thread comment'],
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.DID_NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'thread comment',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
