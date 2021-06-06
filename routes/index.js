const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieRouter = require('./movies');
const userRouter = require('./users');
const {
  createUser, login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const AuthError = require('../errors/401-Error');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина поля "password" 8 символов',
        'string.required': 'Поле "password" должно быть заполнено',
      }),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина поля "password" 8 символов',
        'string.required': 'Поле "password" должно быть заполнено',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" 8 символов',
        'string.max': 'Максимальная длина поля "name" 8 символов',
        'string.required': 'Поле "name" должно быть заполнено',
      }),
  }),
}), createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use(() => new AuthError('Необходима авторизация3'));

module.exports = router;
