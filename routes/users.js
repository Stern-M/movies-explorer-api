const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  userDataUpdate, getUser,
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" 8 символов',
        'string.max': 'Максимальная длина поля "name" 8 символов',
        'string.required': 'Поле "name" должно быть заполнено',
      }),
  }),
}), userDataUpdate);

module.exports = router;
