/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const AuthorizationError = require('../errors/AuthorizationError');

const DuplicateError = require('../errors/DuplicateError');

const IternalServerError = require('../errors/IternalServerError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.send({ data: user });
        })
        .catch((err) => {
          next(err);
        });
    });
};

module.exports.editUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 400) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 400) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.userId)
      .orFail(new NotFoundError('Not Found'))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        next(err);
      });
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
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
      next(new AuthorizationError(err.message));
    });
};
