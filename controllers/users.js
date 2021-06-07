const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/404-Error');
const BadRequestError = require('../errors/400-Error');
const AuthError = require('../errors/401-Error');
const Error500 = require('../errors/500-Error');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUNDS = 10;

// создание пользователя signup
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  return bcrypt.hash(password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        res.status(409).send({ message: 'Пользователь с переданный email уже существует' });
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === !'ValidationError') {
        next(new Error500('Что-то пошло не так'));
      }
    });
};

// авторизация пользователя signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Ошибка авторизации. Неправильные почта или пароль!');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Ошибка авторизации. Неправильные почта или пароль!'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.status(201).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
            .send({
              _id: user._id,
              name: user.name,
              email: user.email,
              token,
            });
        })
        .catch(() => { next(new AuthError('Ошибка авторизации')); });
    })
    .catch(next);
};

// запрос информации о пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError('Такого пользователя нет в базе'));
      } else {
        next(new Error500('Что-то пошло не так'));
      }
    });
};

// изменение информации о пользователе
module.exports.userDataUpdate = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: req.body.name, email: req.body.email } },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError('Такого пользователя нет в базе'));
      } else {
        next(new Error500('Что-то пошло не так'));
      }
    });
};
