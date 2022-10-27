/* eslint-disable max-len */
const IternalServerError = 500;

module.exports = (err, req, res, next) => {
  if ((err.statusCode === 401) || (err.statusCode === 404) || (err.statusCode === 409) || (err.statusCode === 403)) {
    res.status(err.statusCode).send({ message: err.message });
    console.log(err);
  } else {
    res.status(IternalServerError).send({ message: err.message });
    console.log(err);
  }
  next();
};
