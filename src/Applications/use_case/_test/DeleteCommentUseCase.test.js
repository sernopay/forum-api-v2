const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockComment = new Comment({
      id: mockCommentId,
      threadId: mockThreadId,
      content: 'content',
      createdAt: '2021-08-08T07:22:33Z',
      owner: mockUserId,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(mockUserId, mockThreadId, mockCommentId);

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(mockCommentId);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(mockCommentId, mockUserId);
  });

  it('should throw error if thread not found', async () => {
    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(false));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(mockUserId, mockThreadId, mockCommentId))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
  });

  it('should throw error if comment not found', async () => {
    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(null));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(mockUserId, mockThreadId, mockCommentId))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(mockCommentId);
  });

  it('should throw error if user not authorized', async () => {
    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockComment = new Comment({
      id: mockCommentId,
      threadId: mockThreadId,
      content: 'content',
      createdAt: '2021-08-08T07:22:33Z',
      owner: 'user-124',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(mockUserId, mockThreadId, mockCommentId))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.CANNOT_DELETE_OTHER_USER_COMMENT');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(mockCommentId);
  });
});
