class LikeUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, threadId, commentId) {
    // Validate thread
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new Error('LIKE_UNLIKE_USE_CASE.THREAD_NOT_FOUND');
    }

    // Validate Comment
    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment) {
      throw new Error('LIKE_UNLIKE_USE_CASE.COMMENT_NOT_FOUND');
    }

    // Like or Unlike
    const like = await this._likeRepository.getLikeByCommentIdAnduserId(commentId, userId);
    if (like) {
      await this._likeRepository.deleteLike(commentId, userId);
    } else {
      await this._likeRepository.createLike(commentId, userId);
    }
  }
}

module.exports = LikeUnlikeUseCase;
