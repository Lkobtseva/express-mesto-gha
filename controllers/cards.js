const { constants } = require('http2');
const userSchema = require('../models/user');
const errors = require('./errors');

// Поиск всех пользователей
module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.status(constants.HTTP_STATUS_OK).send(users));
};

// Создание пользователя
module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// Поиск пользователя по ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  userSchema
    .findById(userId)
    .orFail(new Error(errors.ERROR_404_USER_NOT_FOUND))
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный формат данных' });
      } else if (err.message === errors.ERROR_404_USER_NOT_FOUND) {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// Обновление данных пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error(errors.ERROR_404_USER_NOT_FOUND))
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      } else if (err.message === errors.ERROR_404_USER_NOT_FOUND) {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации данных' });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
