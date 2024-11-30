const CreateReplyUseCase = require('../CreateReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

describe('CreateReplyUseCase', () => {
  it('should orchestrating the create reply action correctly', async () => {
    const useCasePayload = {
      content: 'dicoding',
    };

    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockComment = new Comment({
      id: mockCommentId,
      threadId: mockThreadId,
      content: 'komentar',
      createdAt: '2024-08-01T07:59:01.339Z',
      owner: mockUserId,
    });
    const mockCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: 'dicoding',
      owner: 'user-123',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.createReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));

    const createReplyUseCase = new CreateReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const expectedCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: 'dicoding',
      owner: 'user-123',
    });

    const createdReply = await createReplyUseCase.execute(mockUserId, mockThreadId, mockCommentId, useCasePayload);

    expect(createdReply).toStrictEqual(expectedCreatedReply);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(mockCommentId);
    expect(mockReplyRepository.createReply).toBeCalledWith({
      content: useCasePayload.content,
      owner: mockUserId,
      commentId: mockCommentId,
      threadId: mockThreadId,
    });
  });

  it('should throw error when thread not found', async () => {
    const useCasePayload = {
      content: 'dicoding',
    };

    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    const createReplyUseCase = new CreateReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(createReplyUseCase.execute(mockUserId, mockThreadId, mockCommentId, useCasePayload))
      .rejects
      .toThrowError('CREATE_REPLY_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
  });

  it('should throw error when comment not found', async () => {
    const useCasePayload = {
      content: 'dicoding',
    };

    const mockUserId = 'user-123';
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    const createReplyUseCase = new CreateReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(createReplyUseCase.execute(mockUserId, mockThreadId, mockCommentId, useCasePayload))
      .rejects
      .toThrowError('CREATE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(mockCommentId);
  });
});
