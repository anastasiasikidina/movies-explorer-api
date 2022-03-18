const usersRouter = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/users');
const { validatePatchProfileInfo } = require('../middlewares/validations');

usersRouter.get('/me', getProfile);
usersRouter.patch('/me', validatePatchProfileInfo, updateProfile);

module.exports = usersRouter;
