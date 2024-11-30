const CreateThread = require('../CreateThread');

const ErrorCreateThreadNotContainNeededProperty = 'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY';
const ErrorCreateThreadNotMeetDataTypeSpecification = 'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION';

describe('CreateThread entities', () => {
  it('should throw error when payload not contain title property', () => {
    // Arrange
    const payload = {
      body: 'asdf',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(ErrorCreateThreadNotContainNeededProperty);
  });

  it('should throw error when payload not contain body property', () => {
    // Arrange
    const payload = {
      title: 'asdf',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(ErrorCreateThreadNotContainNeededProperty);
  });

  it('should throw error when payload not contain owner property', () => {
    // Arrange
    const payload = {
      title: 'asdf',
      body: 'asdf',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(ErrorCreateThreadNotContainNeededProperty);
  });

  it('should throw error when title not string', () => {
    // Arrange
    const payload = {
      title: true,
      body: 'asdf',
      owner: 'asdf',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(ErrorCreateThreadNotMeetDataTypeSpecification);
  });

  it('should throw error when body not string', () => {
    // Arrange
    const payload = {
      title: 'asdf',
      body: true,
      owner: 'asdf',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(ErrorCreateThreadNotMeetDataTypeSpecification);
  });

  it('should throw error when owner not string', () => {
    // Arrange
    const payload = {
      title: 'asdf',
      body: 'asdf',
      owner: true,
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(ErrorCreateThreadNotMeetDataTypeSpecification);
  });

  it('should createCreateThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'asdf',
      body: 'asdf',
      owner: 'asdf',
    };

    // Action
    const createThread = new CreateThread(payload);

    // Assert
    expect(createThread.title).toEqual(payload.title);
    expect(createThread.body).toEqual(payload.body);
    expect(createThread.owner).toEqual(payload.owner);
  });
});
