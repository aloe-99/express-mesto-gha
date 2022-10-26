module.exports = class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.errorCode = 401;
    this.statusCode = 401;
    this.errorMessage = message;
    this.name = 'AuthorizationError';
  }
};
