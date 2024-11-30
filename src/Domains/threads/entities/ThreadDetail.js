class ThreadDetail {
  constructor({
    id, title, body, date, username,
  }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.username = username;
    this.date = date;
  }
}

module.exports = ThreadDetail;
