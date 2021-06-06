const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  userDataUpdate, getUser,
} = require('../controllers/users');
// eslint-disable-next-line no-useless-escape
const pattern = '(?:http(s)?:\/\/)?[\\w.-]+(?:\.[\\w\.-]+)+[\\w\\W]+(?:png|jpg)?';

router.get('/users/me', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(2).max(30).required(),
  }),
}), userDataUpdate);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(RegExp(pattern)),
  }),
}), userAvatarUpdate);

module.exports = router;
