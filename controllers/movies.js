const Movie = require('../models/movie');
const NotFoundError = require('../errors/404-Error');
const BadRequestError = require('../errors/400-Error');
const Error500 = require('../errors/500-Error');
const ForbiddenError = require('../errors/403-Error');

module.exports.createMovie = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    thumbnail: req.body.thumbnail,
    owner: req.user._id,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new Error500('Что-то пошло не так'));
      }
    });
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({}).select('+owner')
    .sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    .catch(() => next(new Error500('Что-то пошло не так')));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id).select('+owner')
    .orFail(new NotFoundError('Такой карточки нет'))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        return movie.remove()
          .then(() => res.status(200).send({ message: 'Карточка успешно удалена!' }));
      } return next(new ForbiddenError('Вы не можете удалять чужие карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};
