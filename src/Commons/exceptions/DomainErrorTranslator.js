const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'CREATE_COMMENT_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat membuat komentar baru karena thread tidak ditemukan'),
  'CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'),
  'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'),
  'DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus komentar karena thread tidak ditemukan'),
  'DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menghapus komentar karena komentar tidak ditemukan'),
  'DELETE_COMMENT_USE_CASE.CANNOT_DELETE_OTHER_USER_COMMENT': new AuthorizationError('tidak dapat menghapus komentar karena kamu bukan pemilik komentar'),
  'GET_DETAIL_THREAD_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('thread tidak ditemukan'),
  'CREATE_REPLY_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat membuat balasan karena thread tidak ditemukan'),
  'CREATE_REPLY_USE_CASE.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat membuat balasan karena komentar tidak ditemukan'),
  'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada'),
  'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat balasan karena tipe data tidak sesuai'),
  'DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus balasan karena thread tidak ditemukan'),
  'DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menghapus balasan karena komentar tidak ditemukan'),
  'DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND': new NotFoundError('tidak dapat menghapus balasan karena balasan tidak ditemukan'),
  'DELETE_REPLY_USE_CASE.CANNOT_DELETE_OTHER_USER_REPLY': new AuthorizationError('tidak dapat menghapus balasan karena kamu bukan pemilik balasan'),
  'LIKE_UNLIKE_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat memberikan like pada komentar karena thread tidak ditemukan'),
  'LIKE_UNLIKE_USE_CASE.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat memberikan like pada komentar karena komentar tidak ditemukan'),
};

module.exports = DomainErrorTranslator;
