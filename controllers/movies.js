const Movie = require('../models/movie');
const NotFoundError = require('../errors/404-Error');
const BadRequestError = require('../errors/400-Error');
const Error500 = require('../errors/500-Error');
const ForbiddenError = require('../errors/403-Error');

module.exports.createMovie = (req, res, next) => {
  Movie.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === !'ValidationError') {
        next(new Error500('Что-то пошло не так'));
      }
    });
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    .catch(() => next(new Error500('Что-то пошло не так')));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner == req.user._id) {
        Movie.findByIdAndDelete(req.params.id)
          .then(() => res.status(200).send({ message: 'Карточка успешно удалена!' }))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError('Переданы некорректные данные карточки'));
            } else {
              next(new Error500('Что-то пошло не так'));
            }
          });
      } else {
        next(new ForbiddenError('Вы не можете удалять чужие карточки'));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Такой карточки нет'));
      } else {
        next(new Error500('Что-то пошло не так'));
      }
    });
};
