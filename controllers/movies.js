/* eslint-disable indent */
const Movie = require('../models/Movies');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const errorMessages = require('../errors/messages');
const NotFoundError = require('../errors/forbidden-error');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .orFail(new NotFoundError('Фильмы не найдены'))
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err);
        next(new BadRequestError(errorMessages.badRequestMovie));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const me = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorMessages.notFoundMovie);
      }
      if (me.toString() !== movie.owner.toString()) {
        throw new ForbiddenError(errorMessages.notMyMovie);
      }
      Movie.deleteOne({ _id: movie._id })
        .then((deleteInfo) => {
          res.status(200).send({ deleteInfo });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(errorMessages.notFoundMovie));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
