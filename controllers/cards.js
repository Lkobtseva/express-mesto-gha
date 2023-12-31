const cardSchema = require('../models/card');
const NotFound = require('../errors/NotFound'); // код 404
const CurrentErr = require('../errors/CurrentErr'); // код 403
const BadRequest = require('../errors/BadRequest'); // код 400
// Получить все карточки
module.exports.getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// Создать карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// Удалить карточку
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new CurrentErr('Вы не можете удалить чужую карточку'));
      }
      return cardSchema.findByIdAndRemove(cardId).then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

// Поставить лайк
module.exports.addLike = (req, res, next) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

// Убрать лайк
module.exports.removeLike = (req, res, next) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};
