const cardRoutes = require('express').Router();

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', validationCreateCard, createCard);
cardRoutes.delete('/:cardId', validationCardById, deleteCard);
cardRoutes.put('/:cardId/likes', validationCardById, addLike);
cardRoutes.delete('/:cardId/likes', validationCardById, removeLike);

module.exports = cardRoutes;
