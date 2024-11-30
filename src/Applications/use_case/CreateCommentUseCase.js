const CreateComment = require('../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId, userPayload) {
    const isThreadExist = await this._threadRepository.isThreadExist(threadId);
    if (!isThreadExist) {
      throw new Error('CREATE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }
    const createComment = new CreateComment({ ...userPayload, owner: userId, threadId });
    return this._commentRepository.createComment(createComment);
  }
}

module.exports = CreateCommentUseCase;
