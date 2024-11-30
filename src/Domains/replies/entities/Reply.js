class Reply {
  constructor({
    id, content, date, username, deletedAt, owner,
  }) {
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.deletedAt = deletedAt;
    this.owner = owner;
  }
}
module.exports = Reply;
