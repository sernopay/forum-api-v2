class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, commentId, content, owner,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({
    content, owner, threadId, commentId,
  }) {
    if (!content || !owner || !threadId || !commentId) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateReply;
