module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.errorCode = 400;
    this.statusCode = 400;
    this.errorMessage = message;
    this.name = 'BadRequestError';
  }
};
