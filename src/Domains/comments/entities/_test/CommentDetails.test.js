const CommentDetails = require('../CommentDetails');

describe('Comment Details entities', () => {
  it('should throw error if not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not contain correct data type', () => {
    // Arrange
    const payload = {
      id: 123,
      username: ['dicoding'],
      createdAt: new Date(),
      content: 123,
      isDelete: 'true',
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create CommentDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      createdAt: new Date().toDateString(),
      content: 'thread comment',
      isDelete: false,
    };

    // Action
    const {
      id, username, date, content,
    } = new CommentDetails(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.createdAt);
    expect(content).toEqual(payload.content);
  });

  it('should show content as **komentar telah dihapus** if is_delete equal true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      createdAt: new Date().toDateString(),
      content: 'thread comment',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content,
    } = new CommentDetails(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.createdAt);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
