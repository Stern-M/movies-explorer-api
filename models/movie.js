const mongoose = require('mongoose');
const validate = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minLength: [2, 'Минимум 2 символа'],
  },
  director: {
    type: String,
    require: true,
    minLength: [2, 'Минимум 2 символа'],
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validate.isURL(v, { require_protocol: true }),
      message: (props) => `${props.value} Неверный URL`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validate.isURL(v, { require_protocol: true }),
      message: (props) => `${props.value} Неверный URL`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validate.isURL(v, { require_protocol: true }),
      message: (props) => `${props.value} Неверный URL`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    match: [/^[а-яА-Я0-9:.,?!@&#*$^]{0,}$/,'Название на русском языке' ],
  },
  nameEN: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9:.,?!@&#*$^]{0,}$/,'Название на английском языке' ],
  }
});
module.exports = mongoose.model('movie', movieSchema);
