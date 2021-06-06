const router = require('express').Router;
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
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new AuthError('Необходима авторизация'));
});

module.exports = router;
