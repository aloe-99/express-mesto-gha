/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const isEmail = require('validator/lib/isEmail');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const AuthorizationError = require('../errors/AuthorizationError');

const IternalServerError = require('../errors/IternalServerError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      throw new IternalServerError('Неизвестная ошибка сервера');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      if (!isEmail(email)) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new IternalServerError('Неизвестная ошибка сервера');
    })
    .catch(next);
};

module.exports.editUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new IternalServerError('Неизвестная ошибка сервера');
    })
    .catch(next);
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new IternalServerError('Неизвестная ошибка сервера');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.userId)
      .orFail(new NotFoundError('Not Found'))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          throw new NotFoundError('Запрашиваемый пользователь не неайден');
        }
        throw new IternalServerError('Неизвестная ошибка сервера');
      })
      .catch(next);
  } else {
    throw new BadRequestError('Переданы некорректные данные');
  }
};

module.exports.getAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthorizationError(err.message);
    })
    .catch(next);
};
