const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('./components/user/model')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        let newUser =  await UserModel.create({email: email, password: password});
        return newUser;
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({
          where: {
            mail: email,
          }
        });
        //Non ho trovato alcun utente associato all'indirizzo e-mail 
        if (!user) {
          return done(null, false, { message: 'Utente non trovato' });
        }

        const validate = await user.validPassword(password);
        //La password ricevuta nel corpo della richiesta non è valida
        if (!validate) {
          return done(null, false, { message: 'Password Errata' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);