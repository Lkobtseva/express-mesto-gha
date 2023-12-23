const cardRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLikes,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', addLike);
cardRoutes.delete('/:cardId/likes', deleteLikes);

module.exports = cardRoutes;
