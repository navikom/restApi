const { to } = require('await-to-js');
const pe = require('parse-error');

exports.to = async (promise) => {
  let [err, res] = await to(promise);
  if (err) return [pe(err)];

  return [null, res];
};

exports.ReE = function(res, err, code) { // Error Web Response
  if (typeof err === 'object' && typeof err.message !== 'undefined') {
    err = err.message;
  }

  if (code !== undefined) res.statusCode = code;

  return res.json({ success: false, error: err });
};

exports.ReS = function(res, data, code) { // Success Web Response
  let send_data = { success: true };

  if (typeof data === 'object') {
    send_data = Object.assign(data, send_data);//merge the objects
  }

  if (code !== undefined) res.statusCode = code;

  return res.json(send_data)
};

exports.TE = function(err_message, log) { // TE stands for Throw Error
  if (log === true) {
    console.error(err_message);
  }

  throw new Error(err_message);
};

exports.passportService = function(passport) {
  return async (req, res, next) => {
    const user = await to(new Promise((resolve, reject) => {
      passport.authenticate('jwt', function(err, user, info) {
        if(!user) {
          reject(info);
        } else {
          resolve(user);
        }
      })(req, res, next);
    }));
    return user;
  }
};