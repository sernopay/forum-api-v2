const CommentInThread = require('../CommentInThread');

describe('a CommentInThread entities', () => {
  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-08-08T07:59:25.572Z',
      content: 'ini adalah komentar',
      deletedAt: '2021-08-08T07:59:25.572Z',
    };

    // Action
    const comment = new CommentInThread(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.deletedAt).toEqual(payload.deletedAt);
  });
});
