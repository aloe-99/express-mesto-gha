module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.errorCode = 403;
    this.statusCode = 403;
    this.errorMessage = message;
    this.name = 'ForbiddenError';
  }
};
