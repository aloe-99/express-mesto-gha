/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new AuthorizationError('Ошибка авторизации'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthorizationError('Ошибка авторизации'));
  }
  req.user = payload;

  next();
};
