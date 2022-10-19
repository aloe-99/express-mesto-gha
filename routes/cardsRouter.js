const cardsRouter = require('express').Router();

const bodyParser = require('body-parser');

const { getCards, createCard, likeCard, removeLike, deleteCard } = require('../controllers/card');

cardsRouter.use(bodyParser.json());
cardsRouter.use(bodyParser.urlencoded({ extended: true }));

cardsRouter.get('/', getCards);

cardsRouter.post('/', createCard);

cardsRouter.put('/:cardId/likes', likeCard);

cardsRouter.delete('/:cardId/likes', removeLike);

cardsRouter.delete('/:cardId', deleteCard);

module.exports = cardsRouter;