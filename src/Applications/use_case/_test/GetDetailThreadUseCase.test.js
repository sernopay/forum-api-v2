const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentInThread = require('../../../Domains/comments/entities/CommentInThread');
const Reply = require('../../../Domains/replies/entities/Reply');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    const mockThreadId = 'thread-123';

    const mockThread = new ThreadDetail({
      id: 'thread-123',
      title: 'test',
      body: 'test body',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
    });

    const mockCommentInThread = new CommentInThread(
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:58.382Z',
        content: 'test',
        replies: [],
      },
    );

    const mockReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve([mockCommentInThread]));

    mockReplyRepository.getRepliesByCommentId = jest.fn().mockImplementation(() => Promise.resolve([mockReply]));

    mockLikeRepository.countLikeByCommentId = jest.fn().mockImplementation(() => Promise.resolve(0));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(mockThreadId);

    const expectedCommentInThread = new CommentInThread({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
    });

    const expectedReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      owner: 'user-123',
    });

    const expectedThread = new ThreadDetail({
      id: 'thread-123',
      title: 'test',
      body: 'test body',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
    });

    const expectedLikeCount = 0;

    expectedCommentInThread.replies = [expectedReply];
    expectedCommentInThread.likeCount = expectedLikeCount;

    expect(detailThread).toStrictEqual({ ...expectedThread, comments: [expectedCommentInThread] });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });

  it('should throw error if thread not found', async () => {
    const mockThreadId = 'thread-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(null));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(getDetailThreadUseCase.execute(mockThreadId)).rejects.toThrowError('GET_DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
  });

  it('should orchestrating the get detail thread action correctly with deleted comment', async () => {
    const mockThreadId = 'thread-123';

    const mockThread = new ThreadDetail({
      id: mockThreadId,
      title: 'test',
      body: 'test body',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
    });

    const mockCommentInThread = new CommentInThread(
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:58.382Z',
        content: 'test',
        deletedAt: '2021-08-08T07:22:58.382Z',
      },
    );

    const mockReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve([mockCommentInThread]));
    mockReplyRepository.getRepliesByCommentId = jest.fn().mockImplementation(() => Promise.resolve([mockReply]));
    mockLikeRepository.countLikeByCommentId = jest.fn().mockImplementation(() => Promise.resolve(0));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(mockThreadId);

    const expectedCommentInThread = new CommentInThread({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      deletedAt: '2021-08-08T07:22:58.382Z',
    });
    const expectedReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      owner: 'user-123',
    });
    const expectedThread = new ThreadDetail({
      id: 'thread-123',
      title: 'test',
      body: 'test body',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
    });
    const expectedLikeCount = 0;

    expectedCommentInThread.replies = [expectedReply];
    expectedCommentInThread.content = '**komentar telah dihapus**';
    expectedCommentInThread.likeCount = expectedLikeCount;

    expect(detailThread).toStrictEqual({ ...expectedThread, comments: [expectedCommentInThread] });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });

  it('should orchestrating the get detail thread action correctly with deleted reply', async () => {
    const mockThreadId = 'thread-123';

    const mockThread = new ThreadDetail({
      id: mockThreadId,
      title: 'test',
      body: 'test body',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
    });

    const mockCommentInThread = new CommentInThread(
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:58.382Z',
        content: 'test',
      },
    );

    const mockReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      owner: 'user-123',
      deletedAt: '2021-08-08T07:22:58.382Z',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve([mockCommentInThread]));
    mockReplyRepository.getRepliesByCommentId = jest.fn().mockImplementation(() => Promise.resolve([mockReply]));
    mockLikeRepository.countLikeByCommentId = jest.fn().mockImplementation(() => Promise.resolve(0));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(mockThreadId);

    const expectedCommentInThread = new CommentInThread({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
    });
    const expectedReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
      content: 'test',
      owner: 'user-123',
      deletedAt: '2021-08-08T07:22:58.382Z',
    });
    expectedReply.content = '**balasan telah dihapus**';
    expectedLikeCount = 0;

    expectedCommentInThread.replies = [expectedReply];
    expectedCommentInThread.likeCount = expectedLikeCount;

    const expectedThread = new ThreadDetail({
      id: 'thread-123',
      title: 'test',
      body: 'test body',
      username: 'dicoding',
      date: '2021-08-08T07:22:58.382Z',
    });

    expect(detailThread).toStrictEqual({ ...expectedThread, comments: [expectedCommentInThread] });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });
});
