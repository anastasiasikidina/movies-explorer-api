require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-error');
const errorMessages = require('../errors/messages');
// const { JWT_SECRET_LOCAL } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError(errorMessages.unauthorized);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-very-secret-code');
  } catch (err) {
    throw new NotAuthError(errorMessages.unauthorized);
  }

  req.user = payload;
  next();
};

module.exports = auth;
