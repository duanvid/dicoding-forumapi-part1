const ReplyDetails = require('../ReplyDetails');

describe('ReplyDetails entities', () => {
  it('should throw error if payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'comment replies',
      createdAt: new Date('2023-01-01').toISOString(),
      isDelete: false,
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not contain corect data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: ['comment replies'],
      createdAt: new Date('2023-01-01').toISOString(),
      isDelete: 'false',
      username: true,
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError('REPLY_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create reply details object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'comment replies',
      createdAt: new Date('2023-01-01').toISOString(),
      isDelete: false,
      username: 'dicoding',
    };

    // Action
    const {
      id, content, date, username,
    } = new ReplyDetails(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.createdAt);
    expect(username).toEqual(payload.username);
  });

  it('should show content as **balasan sudah dihapus** if isDelete equal TRUE', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'comment replies',
      createdAt: new Date('2023-01-01').toISOString(),
      isDelete: true,
      username: 'dicoding',
    };

    // Action
    const {
      id, content, date, username,
    } = new ReplyDetails(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan sudah dihapus**');
    expect(date).toEqual(payload.createdAt);
    expect(username).toEqual(payload.username);
  });
});
