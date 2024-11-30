const CreateReply = require('../CreateReply');

describe('CreateReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: '',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 1,
      commentId: 'comment-123',
      content: 'reply',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createReply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'reply',
      owner: 'user-123',
    };

    // Action
    const createReply = new CreateReply(payload);

    // Assert
    expect(createReply.threadId).toEqual(payload.threadId);
    expect(createReply.commentId).toEqual(payload.commentId);
    expect(createReply.content).toEqual(payload.content);
    expect(createReply.owner).toEqual(payload.owner);
  });
});
