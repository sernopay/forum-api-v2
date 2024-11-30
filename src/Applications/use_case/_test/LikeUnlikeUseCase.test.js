const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUnlikeUseCase = require('../LikeUnlikeUseCase');
const Comment = require('../../../Domains/comments/entities/Comment');
const Like = require('../../../Domains/likes/entities/Like');

describe('LikeUnlikeUseCase', () => {
    it('should throw error when the thread is invalid', async () => {
        // Arrange
        const mockThreadId = 'thread-123';
        const threadRepository = new ThreadRepository();

        threadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(false));

        const likeUnlikeUseCase = new LikeUnlikeUseCase({
            threadRepository: threadRepository, 
            commentRepository: null, 
            likeRepository: null,
        });

        // Action
        await expect(likeUnlikeUseCase.execute('user-123', 'thread-123', 'comment-123'))
            .rejects
            .toThrowError('LIKE_UNLIKE_USE_CASE.THREAD_NOT_FOUND');
        expect(threadRepository.isThreadExist).toBeCalledWith(mockThreadId);
    })

    it('should throw error when the comment is invalid', async () => {
        // Arrange
        const mockThreadId = 'thread-123';
        const mockCommentId = 'comment-123';

        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();

        threadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
        commentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(null));

        // Action
        const likeUnlikeUseCase = new LikeUnlikeUseCase({
            threadRepository: threadRepository, 
            commentRepository: commentRepository, 
            likeRepository: null,
        });

        // Assert
        await expect(likeUnlikeUseCase.execute('user-123', mockThreadId, mockCommentId))
            .rejects
            .toThrowError('LIKE_UNLIKE_USE_CASE.COMMENT_NOT_FOUND');
        expect(threadRepository.isThreadExist).toBeCalledWith(mockThreadId)
        expect(commentRepository.getCommentById).toBeCalledWith(mockCommentId)
    })

    it('should add like when the commment is not liked', async () => {
        // Arrange
        const mockThreadId = 'thread-123';
        const mockCommentId = 'comment-123';
        const mockUserId = 'user-123';

        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const likeRepository = new LikeRepository();

        const mockComment = new Comment({
            id: mockCommentId,
            threadId: mockThreadId,
            content: 'dicoding',
            owner: 'user-123',
        });

        threadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
        commentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
        likeRepository.getLikeByCommentIdAnduserId = jest.fn().mockImplementation(() => Promise.resolve(null));
        likeRepository.createLike = jest.fn().mockImplementation(() => Promise.resolve('like-123'));

        // Action
        const likeUnlikeUseCase = new LikeUnlikeUseCase({
            threadRepository: threadRepository, 
            commentRepository: commentRepository, 
            likeRepository: likeRepository,
        });


        // Assert
        await likeUnlikeUseCase.execute(mockUserId, mockThreadId, mockCommentId);

        expect(threadRepository.isThreadExist).toBeCalledWith(mockThreadId);
        expect(commentRepository.getCommentById).toBeCalledWith(mockCommentId);
        expect(likeRepository.getLikeByCommentIdAnduserId).toBeCalledWith(mockCommentId, mockUserId);
        expect(likeRepository.createLike).toBeCalledWith(mockCommentId, mockUserId);
    })

    it('should delete like when the commment is liked', async () => {
        // Arrange
        const mockThreadId = 'thread-123';
        const mockCommentId = 'comment-123';
        const mockUserId = 'user-123';

        const threadRepository = new ThreadRepository();
        const commentRepository = new CommentRepository();
        const likeRepository = new LikeRepository();

        const mockComment = new Comment({
            id: mockCommentId,
            threadId: mockThreadId,
            content: 'dicoding',
            owner: 'user-123',
        });

        const mockLike = new Like({
            id: 'like-123',
            commentId: mockCommentId,
            userId: mockUserId,
        });

        threadRepository.isThreadExist = jest.fn().mockImplementation(() => Promise.resolve(true));
        commentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve(mockComment));
        likeRepository.getLikeByCommentIdAnduserId = jest.fn().mockImplementation(() => Promise.resolve(mockLike));
        likeRepository.deleteLike = jest.fn().mockImplementation(() => Promise.resolve('like-123'));

        // Action
        const likeUnlikeUseCase = new LikeUnlikeUseCase({threadRepository, commentRepository, likeRepository});

        // Assert
        await likeUnlikeUseCase.execute(mockUserId, mockThreadId, mockCommentId);

        expect(threadRepository.isThreadExist).toBeCalledWith(mockThreadId);
        expect(commentRepository.getCommentById).toBeCalledWith(mockCommentId);
        expect(likeRepository.getLikeByCommentIdAnduserId).toBeCalledWith(mockCommentId, mockUserId);
        expect(likeRepository.deleteLike).toBeCalledWith(mockCommentId, mockUserId);
    })
})