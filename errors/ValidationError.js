module.exports = class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.errorCode = 400;
    this.errorMessage = message;
    this.name = 'ValidationError';
  }
};