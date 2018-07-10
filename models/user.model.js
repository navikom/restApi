/**
 * The schema and model for carrier data
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validate = require('mongoose-validator');
const CONFIG = require('../config/config');
const Schema = mongoose.Schema;
const { throwError, to } = require('../services/util.service');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
  phone: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true,//sparse is because now we have two possible unique keys that are optional
    validate: [validate({
      validator: 'isNumeric',
      arguments: [7, 20],
      message: 'Not a valid phone number.',
    })],
  },
  email: {
    type: String, lowercase: true, trim: true, index: true, unique: true, sparse: true,
    validate: [validate({
      validator: 'isEmail',
      message: 'Not a valid email.',
    }),],
  },
  password: {
    type: String,
    required: true,
    default: '123456'
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {

    let err, salt, hash;
    [err, salt] = await to(bcrypt.genSalt(10));
    if (err) {
      throwError(err.message, true);
    }

    [err, hash] = await to(bcrypt.hash(this.password, salt));
    if (err) {
      throwError(err.message, true);
    }

    this.password = hash;
    next();
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async function(pw) {
  let err, pass;
  if (!this.password) throwError('password not set');

  [err, pass] = await to(bcrypt.compare(pw, this.password));
  if (err) throwError(err);

  if (!pass) throwError('invalid password');

  return this;
};

UserSchema.methods.getJWT = function() {
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  return "Bearer " + jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
};

UserSchema.methods.toWeb = function() {
  let json = this.toJSON();
  delete json.password;
  json.id = this._id;//this is for the front end
  return json;
};

exports.model = mongoose.model('Users', UserSchema);