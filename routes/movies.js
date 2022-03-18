const movieRouter = require('express').Router();

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validations');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateCreateMovie, createMovie);
movieRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;

/*
const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieInfo, validateMovieId } = require('../middlewares/validations');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateMovieInfo, createMovie);
moviesRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
*/
