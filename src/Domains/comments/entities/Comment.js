class Comment {
  constructor({
    id, threadId, content, createdAt, owner, deletedAt,
  }) {
    this.id = id;
    this.threadId = threadId;
    this.content = content;
    this.createdAt = createdAt;
    this.owner = owner;
    this.deletedAt = deletedAt;
  }
}

module.exports = Comment;
