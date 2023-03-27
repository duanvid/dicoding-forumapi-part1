const NewComment = require('../../../comments/entities/NewComment');
const NewThread = require('../NewThread');

describe('AddNewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'thread title',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain correct datatype', () => {
    // Arrange
    const payload = {
      title: 12345,
      body: ['thread body'],
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_CORRECT_DATA_TYPE');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'thread title',
      body: 'thread body',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
