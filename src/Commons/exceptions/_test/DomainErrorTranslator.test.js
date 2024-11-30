const AuthorizationError = require('../AuthorizationError');
const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');
const NotFoundError = require('../NotFoundError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_COMMENT_USE_CASE.THREAD_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat membuat komentar baru karena thread tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat menghapus komentar karena thread tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat menghapus komentar karena komentar tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_COMMENT_USE_CASE.CANNOT_DELETE_OTHER_USER_COMMENT')))
      .toStrictEqual(new AuthorizationError('tidak dapat menghapus komentar karena kamu bukan pemilik komentar'));
    expect(DomainErrorTranslator.translate(new Error('GET_DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('thread tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_REPLY_USE_CASE.THREAD_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat membuat balasan karena thread tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_REPLY_USE_CASE.COMMENT_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat membuat balasan karena komentar tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat balasan karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat menghapus balasan karena thread tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat menghapus balasan karena komentar tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat menghapus balasan karena balasan tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_REPLY_USE_CASE.CANNOT_DELETE_OTHER_USER_REPLY')))
      .toStrictEqual(new AuthorizationError('tidak dapat menghapus balasan karena kamu bukan pemilik balasan'));
    expect(DomainErrorTranslator.translate(new Error('LIKE_UNLIKE_USE_CASE.THREAD_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat memberikan like pada komentar karena thread tidak ditemukan'));
    expect(DomainErrorTranslator.translate(new Error('LIKE_UNLIKE_USE_CASE.COMMENT_NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat memberikan like pada komentar karena komentar tidak ditemukan'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
