const CreateCommentUseCase = require('../CreateCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

describe('CreateCommentUseCase', () => {
  it('should orchestrating the create comment action correctly', async () => {
    const useCasePayload = {
      content: 'dicoding',
    };

    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.createComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new CreatedComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123' })));

    const createCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const expectedCreatedComment = new CreatedComment({ id: 'comment-123', content: 'dicoding', owner: 'user-123' });

    const createdComment = await createCommentUseCase.execute(mockUserId, mockThreadId, useCasePayload);

    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.createComment).toBeCalledWith({
      content: useCasePayload.content,
      owner: mockUserId,
      threadId: mockThreadId,
    });
  });
  it('should throw error if thread not found', async () => {
    const useCasePayload = {
      content: 'dicoding',
    };

    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    const createCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(createCommentUseCase.execute(mockUserId, mockThreadId, useCasePayload))
      .rejects
      .toThrowError('CREATE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
  });
});
