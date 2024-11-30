const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      content: 'ini adalah komentar',
      createdAt: '2021-08-08T07:59:25.572Z',
      owner: 'user-123',
      deletedAt: '2021-08-08T07:59:25.572Z',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.content).toEqual(payload.content);
    expect(comment.createdAt).toEqual(payload.createdAt);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.deletedAt).toEqual(payload.deletedAt);
  });
});
