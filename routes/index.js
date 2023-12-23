const router = require('express').Router();
const express = require('express');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
/* router.use('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
}); */
router.use(express.json());
module.exports = router;
