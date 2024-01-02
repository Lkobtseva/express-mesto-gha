const router = require('express').Router();
const express = require('express');

router.use(express.json());

const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFound = require('../errors/NotFound');

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.use((req, res, next) => {
  next(new NotFound('Такая страница не существует'));
});

module.exports = router;
