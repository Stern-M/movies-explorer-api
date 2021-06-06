const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const ruName = '/^[а-яА-Я0-9:.,?!@&#*$^]{0,}$/';
const enName = '/^[a-zA-Z0-9:.,?!@&#*$^]{0,}$/';

router.get('', getAllMovies);
router.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2)
      .messages({
        'string.min': 'Минимальная длина поля "country" 2 символа',
        'string.required': 'Поле "country" должно быть заполнено',
      }),
    director: Joi.string().required().min()
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
    owner: Joi.string().required()
      .messages({
        'string.required': 'Поле "owner" должно быть заполнено',
      }),
    movieId: Joi.number().required()
      .messages({
        'number.required': 'Поле "movieId" должно быть заполнено',
      }),
    nameRU: Joi.string().required().regex(RegExp(ruName))
      .messages({
        'string.required': 'Поле "nameRU" должно быть заполнено',
        'string.regex': 'Используйте кириллицу',
      }),
    nameEN: Joi.string().required().regex(RegExp(enName))
      .messages({
        'string.required': 'Поле "nameEN" должно быть заполнено',
        'string.regex': 'Используйте латиницу',
      }),
  }),
}), createMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
