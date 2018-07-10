const { ExtractJwt, Strategy } = require('passport-jwt');
const User = require('../models/user.model');
const CONFIG = require('../config/config');
const { to, passportService, errorResponse } = require('../services/util.service');

exports.passportStrategy = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.jwt_encryption;

  passport.use(new Strategy(opts, async function(jwt_payload, done) {
    let err, user;
    [err, user] = await to(User.model.findById(jwt_payload.user_id));
    if (err) return done(err, false);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }));
};

exports.swaggerPassport = function(passport) {
  const applyPassport = passportService(passport);
  return function(controller) {
    const action = async (req, res, next) => {
      const [err, user] = await applyPassport(req, res, next);
      if (err) {
        return errorResponse(res, err, 422);
      }
      req.user = user.toWeb();
      controller.action(req, res, next);
    };
    return { spec: controller.spec, action };
  }
};