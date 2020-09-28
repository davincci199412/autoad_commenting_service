const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./keys');

const localOptions = {
  usernameField: 'username',
  passwordField: 'password',
};

const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.',
      });
    }

    if (user.password === password) {
      return done(null, user);
    } else {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.',
      });
    }

    // user.comparePassword(password, (err, isMatch) => {
    //   if (err) {
    //     return done(err);
    //   }
    //   if (!isMatch) {
    //     return done(null, false, {
    //       error: 'Your login details could not be verified. Please try again.',
    //     });
    //   }
    //   return done(null, user);
    // });
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secretOrKey,
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findOne({ username: payload.username }, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(localLogin);
passport.use(jwtLogin);
