const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should create instance object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2021-08-08T07:59:06.577Z',
    };

    const {
      id, title, body, username, date,
    } = new ThreadDetail(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
  });
});
