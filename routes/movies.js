const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('', getAllMovies);
router.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2)
      .messages({
        'string.min': 'Минимальная длина поля "country" 2 символа',
        'string.required': 'Поле "country" должно быть заполнено',
      }),
    director: Joi.string().required().min(2)
      .messages({
        'string.min': 'Минимальная длина поля "director" 2 символа',
        'string.required': 'Поле "director" должно быть заполнено',
      }),
    duration: Joi.number().required()
      .messages({
        'number.required': 'Поле "duration" должно быть заполнено',
      }),
    year: Joi.string().required()
      .messages({
        'string.required': 'Поле "year" должно быть заполнено',
      }),
    description: Joi.string().required()
      .messages({
        'string.required': 'Поле "description" должно быть заполнено',
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" должно быть валидным url-адресом');
    }).messages({
      'string.required': 'Поле "image" должно быть заполнено',
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "trailer" должно быть валидным url-адресом');
    }).messages({
      'string.required': 'Поле "trailer" должно быть заполнено',
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "thumbnail" должно быть валидным url-адресом');
    }).messages({
      'string.required': 'Поле "thumbnail" должно быть заполнено',
    }),
    movieId: Joi.number().required()
      .messages({
        'number.required': 'Поле "movieId" должно быть заполнено',
      }),
    nameRU: Joi.string().required()
      .messages({
        'string.required': 'Поле "nameRU" должно быть заполнено',
      }),
    nameEN: Joi.string().required()
      .messages({
        'string.required': 'Поле "nameEN" должно быть заполнено',
      }),
  }),
}), createMovie);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
