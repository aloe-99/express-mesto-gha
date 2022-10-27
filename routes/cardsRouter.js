/* eslint-disable no-useless-escape */
const cardsRouter = require('express').Router();

const bodyParser = require('body-parser');

const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, likeCard, removeLike, deleteCard,
} = require('../controllers/card');

cardsRouter.use(bodyParser.json());
cardsRouter.use(bodyParser.urlencoded({ extended: true }));

cardsRouter.get('/', getCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/),
  }),
}), createCard);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), likeCard);

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), removeLike);

cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().pattern(/^[0-9a-fA-F]{24}$/),
  }),
}), deleteCard);

module.exports = cardsRouter;
