const Card = require('../models/card');

const { default: mongoose } = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({
          "message": "Запрашиваемый объект не найден"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = mongoose.Types.ObjectId(req.user._id);
  Card.create({ name, link, owner })
    .then(cards => res.send({ data: cards }))
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({
          "message": "Запрашиваемый объект не найден"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({
          "message": "Запрашиваемый объект не найден"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({
          "message": "Запрашиваемый объект не найден"
        });
      }
      res.status(500);
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
      return;
    });
}