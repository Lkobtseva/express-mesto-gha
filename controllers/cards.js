const cardSchema = require('../models/card');
const errors = require('./errors');

// Получить все карточки
module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: errors.ERROR_500 }));
};

// Создать карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errors.ERROR_400 });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};

// Удалить карточку
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: errors.ERROR_404_CARD_NOT_FOUND });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: errors.ERROR_400 });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};

// Поставить лайк
module.exports.addLike = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: errors.ERROR_404_CARD_NOT_FOUND });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: errors.ERROR_INVALID_LIKE_DATA });
      } else if (err.name === 'NotFound') {
        res.status(404).send({ message: errors.ERROR_CARD_NOT_FOUND });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};

// Убрать лайк
module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: errors.ERROR_404_CARD_NOT_FOUND });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: errors.ERROR_400 });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: errors.ERROR_CARD_NOT_FOUND });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};
