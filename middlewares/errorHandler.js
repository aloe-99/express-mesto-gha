/* eslint-disable max-len */
const IternalServerError = 500;

module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    console.log(err);
  } else {
    res.status(IternalServerError).send({ message: 'Неизвестная ошибка сервера' });
    console.log(err);
  }
  next();
};
