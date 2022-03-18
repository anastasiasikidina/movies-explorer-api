const router = require('express').Router();

const {
  validateSignin,
  validateSignup,
} = require('../middlewares/validations');

const {
  login,
  createUser,
  logout,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/not-found-error');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.get('/signout', logout);

router.use(auth, userRouter);
router.use(auth, movieRouter);

router.use('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;

/*
const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');

const moviesRouter = require('./movies');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const { signUp, signIn } = require('../controllers/users');
const {
  validateSignInInfo,
  validateSignUpInfo,
} = require('../middlewares/validations');
const errorMessages = require('../errors/messages');

// open routes for not-authorized users
router.post('/signin', validateSignInInfo, signIn);
router.post('/signup', validateSignUpInfo, signUp);

// check if user authorized
router.use(auth);

// protected by authorization routes below
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundRoute));
});

module.exports = router;
*/
