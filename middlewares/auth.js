const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const AuthError = require('../errors/401-Error');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
