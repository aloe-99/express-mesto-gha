const User = require('../models/user');

const { default: mongoose } = require('mongoose');

const NotFoundError = require('../errors/NotFoundError');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({
          "message": "Запрашиваемый пользователь не найден"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          "message": "Переданы некорректные данные"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.editUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          "message": "Переданы некорректные данные"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true, upsert: false })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          "message": "Переданы некорректные данные"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.getUser = (req, res) => {
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.userId)
      .orFail(new NotFoundError("Not Found"))
      .then(user => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          return res.status(404).send({
            "message": "Запрашиваемый пользователь не найден"
          });
        }
        res.status(500);
        console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
        return;
      });
  } else {
    return res.status(400).send({
      "message": "Переданы некорректный идентификатор пользователя"
    });
  }
};