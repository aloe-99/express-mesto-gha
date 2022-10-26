/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const { default: mongoose } = require('mongoose');

const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');

const BadRequestError = require('../errors/BadRequestError');

const ForbiddenError = require('../errors/ForbiddenError');

const IternalServerError = require('../errors/IternalServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = mongoose.Types.ObjectId(req.user._id);
  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(new IternalServerError('Неизвестная ошибка сервера'));
    });
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
          next(new NotFoundError('Запрашиваемый объект не найден'));
        }
        next(new IternalServerError('Неизвестная ошибка сервера'));
      })
      .catch(next);
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
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
          next(new NotFoundError('Запрашиваемый объект не найден'));
        }
        next(new IternalServerError('Неизвестная ошибка сервера'));
      })
      .catch(next);
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
  }
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  if (cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findById(cardId)
      .then((card) => {
        if (card.owner === owner) {
          Card.findByIdAndRemove(cardId)
            .orFail(new NotFoundError('Not Found'))
            .then((cards) => res.send({ data: cards }))
            .catch((err) => {
              if (err.name === 'NotFoundError') {
                next(new NotFoundError('Запрашиваемый объект не найден'));
              }
              next(new IternalServerError('Неизвестная ошибка сервера'));
            });
        } else {
          next(new ForbiddenError('Доступ к запрашиваемому ресурсу заблокирован'));
        }
      })
      .orFail(new NotFoundError('Not Found'))
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          next(new NotFoundError('Запрашиваемый объект не найден'));
        }
        next(new IternalServerError('Неизвестная ошибка сервера'));
      });
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
  }
};
