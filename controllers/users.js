require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const errorMessages = require('../errors/messages');
const ConflictError = require('../errors/conflict-error');
const NotAuthError = require('../errors/not-auth-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundError(errorMessages.notFoundUser);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundError(errorMessages.notFoundUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequestUser));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.duplicateUser));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const signUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequestUser));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.duplicateUser));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new NotAuthError('Неправильные email/password. Попробуйте еще раз.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new NotAuthError('Неправильные email/password. Попробуйте еще раз.');
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-very-secret-code',
      { expiresIn: '7d' },
    );

    return res.status(200).send({
      token,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getProfile,
  updateProfile,
  signUp,
  signIn,
};
