const usersRouter = require('express').Router();

const bodyParser = require('body-parser');

const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, editUser, editUserAvatar, getUser, getAboutMe,
} = require('../controllers/user');

usersRouter.use(bodyParser.json());
usersRouter.use(bodyParser.urlencoded({ extended: true }));

usersRouter.get('/', getAllUsers);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUser);

usersRouter.get('/me', getAboutMe);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), editUserAvatar);

usersRouter.get('/:userId', getUser);

module.exports = usersRouter;
