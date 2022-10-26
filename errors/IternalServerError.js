module.exports = class IternalServerError extends Error {
  constructor(message) {
    super(message);
    this.errorCode = 500;
    this.statusCode = 500;
    this.errorMessage = message;
    this.name = 'IternalServerError';
  }
};
