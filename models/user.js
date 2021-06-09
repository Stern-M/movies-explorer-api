const mongoose = require('mongoose');
const validate = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    lowercase: true,
    validate: {
      validator: (v) => validate.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" дложно быть заполнено'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minLength: [2, 'Минимальная длина поля 2 символа'],
    maxLength: [30, 'Максимальная длина поля 30 символов'],
  },
});
module.exports = mongoose.model('user', userSchema);
