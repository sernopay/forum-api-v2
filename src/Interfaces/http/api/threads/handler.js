const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const CreateCommentUseCase = require('../../../../Applications/use_case/CreateCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');
const CreateReplyUseCase = require('../../../../Applications/use_case/CreateReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const LikeUnlikeUseCase = require('../../../../Applications/use_case/LikeUnlikeUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.createThreadHandler = this.createThreadHandler.bind(this);
    this.createCommentHandler = this.createCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.createReplyHandler = this.createReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.likeUnlikeHandler = this.likeUnlikeHandler.bind(this);
  }

  async createThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const addedThread = await createThreadUseCase.execute(request.payload, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async createCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const createCommentUseCase = this._container.getInstance(CreateCommentUseCase.name);
    const addedComment = await createCommentUseCase.execute(userId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(userId, threadId, commentId);

    return {
      status: 'success',
    };
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const thread = await getThreadUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async createReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const createReplyUseCase = this._container.getInstance(CreateReplyUseCase.name);
    const addedReply = await createReplyUseCase.execute(
      userId, threadId, commentId, request.payload,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(userId, threadId, commentId, replyId);

    return {
      status: 'success',
    };
  }

  async likeUnlikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeUnlikeUseCase = this._container.getInstance(LikeUnlikeUseCase.name);
    await likeUnlikeUseCase.execute(userId, threadId, commentId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
