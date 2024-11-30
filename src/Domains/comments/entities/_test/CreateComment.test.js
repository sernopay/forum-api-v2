const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: 'comment',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'comment',
      owner: 'user-123',
    };

    // Action
    const createComment = new CreateComment(payload);

    // Assert
    expect(createComment.threadId).toEqual(payload.threadId);
    expect(createComment.content).toEqual(payload.content);
    expect(createComment.owner).toEqual(payload.owner);
  });
});
