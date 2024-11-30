class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, commentId, replyId) {
    // Validate thread
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new Error('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    // Validate comment
    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment) {
      throw new Error('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    // Validate reply
    const reply = await this._replyRepository.getReplyById(replyId);
    if (!reply) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    }
    if (reply.owner !== userId) {
      throw new Error('DELETE_REPLY_USE_CASE.CANNOT_DELETE_OTHER_USER_REPLY');
    }

    // Delete reply
    await this._replyRepository.deleteReplyById(replyId, userId);
  }
}

module.exports = DeleteReplyUseCase;
