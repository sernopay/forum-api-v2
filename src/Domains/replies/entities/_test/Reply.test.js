const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply',
      date: '2021-08-08T07:22:33.555Z',
      username: 'Dicoding',
      deletedAt: '2021-08-08T07:22:33.555Z',
      owner: 'user-123',
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
    expect(reply.deletedAt).toEqual(payload.deletedAt);
    expect(reply.owner).toEqual(payload.owner);
  });
});
