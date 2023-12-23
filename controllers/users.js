const userSchema = require('../models/user');
const errors = require('./errors');

// Поиск всех пользователей
module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: errors.ERROR_500 }));
};

// Создание пользователя
module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: errors.ERROR_400_INVALID_DATA });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};

// Поиск пользователя по ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  userSchema
    .findById(userId)
    .orFail(new Error(errors.ERROR_404_USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: errors.ERROR_400_INVALID_DATA });
      } else if (err.message === errors.ERROR_404_USER_NOT_FOUND) {
        res.status(404).send({ message: errors.ERROR_404_USER_NOT_FOUND });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};

// Обновление данных пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error(errors.ERROR_404_USER_NOT_FOUND))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: errors.ERROR_400_INVALID_DATA });
      } else if (err.message === errors.ERROR_404_USER_NOT_FOUND) {
        res.status(404).send({ message: errors.ERROR_404_USER_NOT_FOUND });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: errors.ERROR_400_INVALID_DATA });
      } else {
        res.status(500).send({ message: errors.ERROR_500 });
      }
    });
};
