const usersRouter = require('express').Router();

const bodyParser = require('body-parser');

const { getAllUsers, createUser, editUser, editUserAvatar, getUser } = require('../controllers/user');

usersRouter.use(bodyParser.json());
usersRouter.use(bodyParser.urlencoded({ extended: true }));

usersRouter.get('/', getAllUsers);

usersRouter.post('/', createUser);

usersRouter.patch('/me', editUser);

usersRouter.patch('/me/avatar', editUserAvatar);

usersRouter.get('/:userId', getUser);

module.exports = usersRouter;