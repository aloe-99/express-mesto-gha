/* eslint-disable consistent-return */
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');

const NOT_FOUND = 404;

const BAD_REQUEST = 400;

const ITERNAL_SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(ITERNAL_SERVER_ERROR).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = mongoose.Types.ObjectId(req.user._id);
  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(ITERNAL_SERVER_ERROR).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new NotFoundError('Not Found'))
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          return res.status(NOT_FOUND).send({
            message: 'Запрашиваемый объект не найден',
          });
        }
        return res.status(ITERNAL_SERVER_ERROR).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
      });
  } else {
    return res.status(BAD_REQUEST).send({
      message: 'Некорректный идентификатор объекта',
    });
  }
};

module.exports.removeLike = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new NotFoundError('Not Found'))
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          return res.status(NOT_FOUND).send({
            message: 'Запрашиваемый объект не найден',
          });
        }
        return res.status(ITERNAL_SERVER_ERROR).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
      });
  } else {
    return res.status(BAD_REQUEST).send({
      message: 'Некорректный идентификатор объекта',
    });
  }
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail(new NotFoundError('Not Found'))
      .then((cards) => res.send({ data: cards }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          return res.status(NOT_FOUND).send({
            message: 'Запрашиваемый объект не найден',
          });
        }
        return res.status(ITERNAL_SERVER_ERROR).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
      });
  } else {
    return res.status(BAD_REQUEST).send({
      message: 'Некорректный идентификатор объекта',
    });
  }
};
