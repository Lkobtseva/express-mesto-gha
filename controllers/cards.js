// controllers/cards.js
const { constants } = require('http2');
const cardSchema = require('../models/card');

// Получить все карточки
module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при получении карточек.' }));
};

// Создать карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при создании карточки.' });
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
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(constants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный _id карточки.' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при удалении карточки.' });
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
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(constants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный _id карточки или пользователь не найден.' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при постановке лайка.' });
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
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(constants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный _id карточки или пользователь не найден.' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка при снятии лайка.' });
      }
    });
};
