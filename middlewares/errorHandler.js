const IternalServerError = 500;

module.exports = (err, req, res, next) => {
  if (err.statusCode === (401 || 404 || 409 || 403)) {
    res.status(err.statusCode).send({ message: err.message });
    console.log(err);
  } else {
    res.status(IternalServerError).send({ message: err.message });
    console.log(err);
  }
  next();
};
