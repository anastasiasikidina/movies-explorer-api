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

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new NotAuthError('К этому ресурсу есть доступ только для авторизированных пользователей'));
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }
  req.user = payload;

  return next();
};
