const { celebrate, Joi } = require('celebrate');
const { isEmail, isURL } = require('validator');

const validateEmail = (value, helpers) => {
  if (isEmail(value)) {
    return value;
  }
  return helpers.message('Поле email заполнено неверно');
};

const validateURL = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message('Поле со ссылкой заполнено неверно');
};

const validateSignInInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .custom(validateEmail),
    password: Joi.string().required().min(8).max(50),
  }),
});

const validateSignUpInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .custom(validateEmail),
    password: Joi.string().required().min(8).max(50),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validatePatchProfileInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().alphanum().length(24)
      .hex(),
  }),
});

module.exports = {
  validateSignInInfo,
  validateSignUpInfo,
  validatePatchProfileInfo,
  validateMovieInfo,
  validateMovieId,
  validateDeleteMovie,
};
