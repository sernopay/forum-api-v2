const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateThreadUseCase = require('../CreateThreadUseCase');

describe('CreateThreadUseCase', () => {
  it('should orchestrating the create thread action correctly', async () => {
    const id = 'thread-123';
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };
    const owner = 'owner';

    const createThread = new CreateThread({ ...useCasePayload, owner });

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'title',
      owner: 'owner',
    });

    /** creating dependency of use case * */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function * */
    mockThreadRepository.createThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread));

    /** creating use case instance * */
    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const expectedCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: 'title',
      owner: 'owner',
    });

    // Action
    const createdThread = await createThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.createThread).toBeCalledWith(createThread);
  });
});
