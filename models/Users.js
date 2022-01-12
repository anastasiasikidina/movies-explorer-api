const { Schema, model } = require('mongoose');
const validatorModule = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return validatorModule.isEmail(v);
      },
      message: 'Неверный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

module.exports = model('user', userSchema);
