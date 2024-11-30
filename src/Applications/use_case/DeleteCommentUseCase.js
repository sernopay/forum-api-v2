class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId) {
    // Validate thread
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    // Validate comment
    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }
    if (comment.owner !== userId) {
      throw new Error('DELETE_COMMENT_USE_CASE.CANNOT_DELETE_OTHER_USER_COMMENT');
    }

    // Delete comment
    await this._commentRepository.deleteCommentById(commentId, userId);
  }
}

module.exports = DeleteCommentUseCase;
