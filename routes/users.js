const userRoutes = require('express').Router();

const {
  getUsers,
  createUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.post('/', createUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);

module.exports = userRoutes;
