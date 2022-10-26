/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const UNAUTHORIZED = 401;

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};
