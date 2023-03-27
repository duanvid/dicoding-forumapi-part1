const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };

    const credentialId = 'user-123';

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: credentialId,
    });

    /** use case dependencies */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      })));

    /** use case instances */
    const getAddedThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getAddedThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), credentialId);
  });
});
