const cardSchema = require('../models/card');

// все карточки
module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};
// создать карточку
module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
// удалить карточку
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
// поставить лайк
module.exports.getLikes = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else if (err.name === 'NotFound') {
        res.status(404).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// убрать лайк
module.exports.deleteLikes = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(500).send({ message: `Ошибка: ${err.message}` });
    });
};
