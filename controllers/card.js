/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const { default: mongoose } = require('mongoose');

const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const IternalServerError = require('../errors/IternalServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      throw new IternalServerError('Неизвестная ошибка сервера');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = mongoose.Types.ObjectId(req.user._id);
  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new IternalServerError('Неизвестная ошибка сервера');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
          throw new NotFoundError('Запрашиваемый объект не неайден');
        }
        throw new IternalServerError('Неизвестная ошибка сервера');
      })
      .catch(next);
  } else {
    throw new BadRequestError('Переданы некорректные данные');
  }
};

module.exports.removeLike = (req, res, next) => {
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
          throw new NotFoundError('Запрашиваемый объект не неайден');
        }
        throw new IternalServerError('Неизвестная ошибка сервера');
      })
      .catch(next);
  } else {
    throw new BadRequestError('Переданы некорректные данные');
  }
};

module.exports.deleteCard = (req, res, next) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail(new NotFoundError('Not Found'))
      .then((cards) => res.send({ data: cards }))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          throw new NotFoundError('Запрашиваемый объект не неайден');
        }
        throw new IternalServerError('Неизвестная ошибка сервера');
      })
      .catch(next);
  } else {
    throw new BadRequestError('Переданы некорректные данные');
  }
};
