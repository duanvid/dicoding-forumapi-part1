const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entities', () => {
  it('should throw error if payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not contain correct data type', () => {
    // Arrange
    const payload = {
      id: 123,
      title: ['thread title'],
      body: true,
      createdAt: 'januari',
      username: 234,
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      createdAt: new Date('2023-01-01').toISOString(),
      username: 'dicoding',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new ThreadDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.createdAt);
    expect(username).toEqual(payload.username);
  });
});
