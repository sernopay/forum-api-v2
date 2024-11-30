const CreateReply = require('../../Domains/replies/entities/CreateReply');

class CreateReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId, userPayload) {
    // Validate thread
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new Error('CREATE_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    // Validate comment
    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment) {
      throw new Error('CREATE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    const createReply = new CreateReply({
      ...userPayload, owner: userId, commentId, threadId,
    });
    return this._replyRepository.createReply(createReply);
  }
}

module.exports = CreateReplyUseCase;
