class CommentInThread {
  constructor({
    id, username, date, content, deletedAt,
  }) {
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.deletedAt = deletedAt;
  }
}

module.exports = CommentInThread;
