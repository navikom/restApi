const User = require('../models/user.model');
const validator = require('validator');
const { to, TE } = require('../services/util.service');

const getUniqueKeyFromBody = function(body) {// this is so they can send in 3 options unique_key, email, or phone and it will work
  let uniqueKey = body.unique_key;
  if (uniqueKey === undefined) {
    if (body.email !== undefined) {
      uniqueKey = body.email
    } else if (body.phone !== undefined) {
      uniqueKey = body.phone
    } else {
      uniqueKey = null;
    }
  }

  return uniqueKey;
};
exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

exports.createUser = async function(userInfo) {
  let uniqueKey, authInfo, err, user;

  authInfo = {};
  authInfo.status = 'create';

  uniqueKey = getUniqueKeyFromBody(userInfo);
  if (!uniqueKey) TE('An email or phone number was not entered.');

  if (validator.isEmail(uniqueKey)) {
    authInfo.method = 'email';
    userInfo.email = uniqueKey;

    [err, user] = await to(User.model.create(userInfo));
    if (err) TE(err.message || 'user already exists with that email');

    return user;

  } else if (validator.isMobilePhone(uniqueKey, 'any')) {//checks if only phone number was sent
    authInfo.method = 'phone';
    userInfo.phone = uniqueKey;

    [err, user] = await to(User.model.create(userInfo));
    if (err) TE(err.message || 'user already exists with that phone number');

    return user;
  } else {
    TE('A valid email or phone number was not entered.');
  }
};

exports.authUser = async function(userInfo) {//returns token
  let uniqueKey;
  let authInfo = {};
  authInfo.status = 'login';
  uniqueKey = getUniqueKeyFromBody(userInfo);

  if (!uniqueKey) TE('Please enter an email or phone number to login');


  if (!userInfo.password) TE('Please enter a password to login');

  let user;
  if (validator.isEmail(uniqueKey)) {
    authInfo.method = 'email';

    [err, user] = await to(User.model.findOne({ email: uniqueKey }));
    if (err) TE(err.message);

  } else if (validator.isMobilePhone(uniqueKey, 'any')) {//checks if only phone number was sent
    authInfo.method = 'phone';

    [err, user] = await to(User.model.findOne({ phone: uniqueKey }));
    if (err) TE(err.message);

  } else {
    TE('A valid email or phone number was not entered');
  }

  if (!user) TE('Not registered');

  [err, user] = await to(user.comparePassword(userInfo.password));

  if (err) TE(err.message);

  return user;

};
