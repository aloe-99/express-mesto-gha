/* eslint-disable max-len */
/* eslint-disable consistent-return */
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');

const NOT_FOUND = 404;

const BAD_REQUEST = 400;

const ITERNAL_SERVER_ERROR = 500;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ITERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(ITERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

module.exports.editUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(ITERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(ITERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

module.exports.getUser = (req, res) => {
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.userId)
      .orFail(new NotFoundError('Not Found'))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          return res.status(NOT_FOUND).send({
            message: 'Запрашиваемый пользователь не найден',
          });
        }
        return res.status(ITERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка сервера' });
      });
  } else {
    return res.status(BAD_REQUEST).send({
      message: 'Переданы некорректный идентификатор пользователя',
    });
  }
};
