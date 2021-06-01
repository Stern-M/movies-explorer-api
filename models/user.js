const mongoose = require('mongoose');
const validate = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: (v) => validate.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    // default: 'Жак-Ив Кусто',
    minLength: [2, 'Минимум 2 символа'],
    maxLength: [30, 'Максимум 30 символов'],
  },
});
module.exports = mongoose.model('user', userSchema);
