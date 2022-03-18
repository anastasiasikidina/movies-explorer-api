const userRouter = require('express').Router();

const {
  validateId,
  validateUpdateProfile,
} = require('../middlewares/validations');

const {
  getUserId,
  updateProfile,
} = require('../controllers/users');

userRouter.get('/users/me', validateId, getUserId);
userRouter.patch('/users/me', validateUpdateProfile, updateProfile);

module.exports = userRouter;
/*
const usersRouter = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/users');
const { validatePatchProfileInfo } = require('../middlewares/validations');

usersRouter.get('/me', getProfile);
usersRouter.patch('/me', validatePatchProfileInfo, updateProfile);

module.exports = usersRouter;
*/
