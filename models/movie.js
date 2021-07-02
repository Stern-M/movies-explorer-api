const mongoose = require('mongoose');
const validate = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "country" должно быть заполнено'],
    minLength: [2, 'Минимальная длина 2 символа'],
  },
  director: {
    type: String,
    require: [true, 'Поле "director" должно быть заполнено'],
    minLength: [2, 'Минимальная длина 2 символа'],
  },
  duration: {
    type: Number,
    require: [true, 'Поле "duration" должно быть заполнено'],
  },
  year: {
    type: String,
    require: [true, 'Поле "year" должно быть заполнено'],
  },
  description: {
    type: String,
    require: [true, 'Поле "description" должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "image" должно быть заполнено'],
    validate: {
      validator: (v) => validate.isURL(v, { require_protocol: true }),
      message: 'Поле "image" должно быть валидным url-адресом',
    },
  },
  trailer: {
    type: String,
    required: [true, 'Поле "trailer" должно быть заполнено'],
    validate: {
      validator: (v) => validate.isURL(v, { require_protocol: true }),
      message: 'Поле "trailer" должно быть валидным url-адресом',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "thumbnail" должно быть заполнено'],
    validate: {
      validator: (v) => validate.isURL(v, { require_protocol: true }),
      message: 'Поле "thumbnail" должно быть валидным url-адресом',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    select: true,
    required: [true, 'Поле "owner" должно быть заполнено'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле "movieId" должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле "nameRU" должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле "nameEN" должно быть заполнено'],
  },
});
module.exports = mongoose.model('movie', movieSchema);
