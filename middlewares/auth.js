/*
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-error');
const errorMessages = require('../errors/messages');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError(errorMessages.unauthorized);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new NotAuthError(errorMessages.unauthorized);
  }

  req.user = payload;
  next();
};

module.exports = auth;
*/

const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-error');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotAuthError(`Неавторизованный запрос...auth: ${authorization} and startWith: ${authorization.startsWith('Bearer')}`);
    }

    const token = authorization.replace('Bearer ', '');

    let payload = undefined;
    const { NODE_ENV, JWT_SECRET } = process.env;
    const secCode = NODE_ENV === 'production' ? JWT_SECRET : 'some-very-secret-code';
    try {
      payload = jwt.verify(token, secCode);
    } catch (err) {
      throw new NotAuthError('Невалидный токен доступа к ресурсу.');
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
