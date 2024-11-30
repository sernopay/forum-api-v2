const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockComment = new Comment({
      id: commentId,
      threadId,
      content: 'comment',
      createdAt: new Date(),
      owner: userId,
    });

    const mockReply = new Reply({
      id: replyId,
      content: 'reply',
      date: new Date(),
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyById = jest.fn().mockImplementation(() => Promise.resolve(mockReply));
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    // Action
    await deleteReplyUseCase.execute(userId, threadId, commentId, replyId);

    // Assert
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.getReplyById)
      .toHaveBeenCalledWith(replyId);
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith(replyId, userId);
  });

  it('should throw error if thread not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(false));

    // Action & Assert
    await expect(deleteReplyUseCase.execute(userId, threadId, commentId, replyId))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
  });

  it('should throw error if comment not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(null));

    // Action & Assert
    await expect(deleteReplyUseCase.execute(userId, threadId, commentId, replyId))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
  });

  it('should throw error if reply not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockComment = new Comment({
      id: commentId,
      threadId,
      content: 'comment',
      createdAt: new Date(),
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyById = jest.fn().mockImplementation(() => Promise.resolve(null));

    // Action & Assert
    await expect(deleteReplyUseCase.execute(userId, threadId, commentId, replyId))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockReplyRepository.getReplyById).toBeCalledWith(replyId);
  });

  it('should throw error if user not authorized', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';

    const mockComment = new Comment({
      id: commentId,
      threadId,
      content: 'comment',
      createdAt: new Date(),
      owner: 'user-321',
    });

    const mockReply = new Reply({
      id: replyId,
      content: 'reply',
      date: new Date(),
      owner: 'user-321',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    mockThreadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyById = jest.fn().mockImplementation(() => Promise.resolve(mockReply));

    // Action & Assert
    await expect(deleteReplyUseCase.execute(userId, threadId, commentId, replyId))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.CANNOT_DELETE_OTHER_USER_REPLY');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockReplyRepository.getReplyById).toBeCalledWith(replyId);
  });
});
