module.exports = class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.errorCode = 11000;
    this.statusCode = 409;
    this.errorMessage = message;
    this.name = 'DuplicateError';
  }
};
