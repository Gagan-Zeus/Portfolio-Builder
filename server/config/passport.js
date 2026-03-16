const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
try {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            if (!email) return done(null, false, { message: 'No email from Google' });

            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
              user = await User.findOne({ email: email.toLowerCase() });
              if (user) {
                user.googleId = profile.id;
                if (!user.authProviders.includes('google')) {
                  user.authProviders.push('google');
                }
                await user.save();
              } else {
                user = await User.create({
                  name: profile.displayName || email.split('@')[0],
                  email: email.toLowerCase(),
                  googleId: profile.id,
                  avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                  authProviders: ['google'],
                  emailVerified: true,
                });
              }
            }
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  } else {
    console.warn('Google OAuth credentials not set — Google login disabled');
  }
} catch (err) {
  console.warn('Failed to initialize Google strategy:', err.message);
}

// GitHub OAuth Strategy
try {
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/github/callback`,
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails && profile.emails[0] && profile.emails[0].value;
            if (!email) return done(null, false, { message: 'No email from GitHub' });

            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
              user = await User.findOne({ email: email.toLowerCase() });
              if (user) {
                user.githubId = profile.id;
                if (!user.authProviders.includes('github')) {
                  user.authProviders.push('github');
                }
                await user.save();
              } else {
                user = await User.create({
                  name: profile.displayName || profile.username || email.split('@')[0],
                  email: email.toLowerCase(),
                  githubId: profile.id,
                  avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                  authProviders: ['github'],
                  emailVerified: true,
                });
              }
            }
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  } else {
    console.warn('GitHub OAuth credentials not set — GitHub login disabled');
  }
} catch (err) {
  console.warn('Failed to initialize GitHub strategy:', err.message);
}
