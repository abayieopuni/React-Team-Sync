import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './appConfig.js';
import AppErrors from '../utils/appError.js';
const { NotFoundException } = AppErrors;
import { ProviderEnum } from '../enum/account-provider.enum.js';
import userModel from '../models/user.model.js';
import { loginOrCreateAccountServices } from '../services/authservices.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.GOOGLE_CALLBACK_URL}`,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {


        console.log('Google Profile:', profile);
        console.log('Google Profile JSON:', profile._json);


        const { email, sub: googleID, picture } = profile._json;
        console.log('Google ID (sub):', googleID);
        if (!googleID) {
          throw new NotFoundException('Google ID(sub) is missing');
        }
        const { user } = await loginOrCreateAccountServices({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleID,
          picture: picture,
          email: email,
        });
      
        console.log('User created or logged in:', user);
        done(null, user);
      } catch (error) {
        console.error('Error in Google strategy callback:', error);
        done(error, false);
      }
    },
  ),
);

// Serialize and deserialize the user for session management
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user); // Serialize the user ID into the session
});

passport.deserializeUser((user, done) => done(null, user));
