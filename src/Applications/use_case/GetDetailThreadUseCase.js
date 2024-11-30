const CommentInThread = require('../../Domains/comments/entities/CommentInThread');
const Reply = require('../../Domains/replies/entities/Reply');

class GetDetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND');
    }

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const updatedComments = await Promise.all(comments.map(async (comment) => {
      const updatedComment = new CommentInThread(comment);
      if (updatedComment.deletedAt) {
        updatedComment.content = '**komentar telah dihapus**';
      }

      const replies = await this._replyRepository.getRepliesByCommentId(updatedComment.id);
      updatedComment.replies = replies.map((reply) => {
        const updatedReply = new Reply(reply);
        if (updatedReply.deletedAt) {
          updatedReply.content = '**balasan telah dihapus**';
        }
        return updatedReply;
      });

      const likeCount = await this._likeRepository.countLikeByCommentId(updatedComment.id);
      updatedComment.likeCount = likeCount;

      return updatedComment;
    }));

    return {
      ...thread,
      comments: updatedComments,
    };
  }
}

module.exports = GetDetailThreadUseCase;
