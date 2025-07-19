import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import db from '../models/index.js';
import { GoogleOAuthStrategy, GitHubOAuthStrategy, FacebookOAuthStrategy } from "../services/OAuthStrategies.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize OAuth strategy instances
const googleStrategy = new GoogleOAuthStrategy();
const githubStrategy = new GitHubOAuthStrategy();
const facebookStrategy = new FacebookOAuthStrategy();

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        googleStrategy.getStrategyConfig(),
        (accessToken, refreshToken, profile, done) =>
            googleStrategy.authenticate(accessToken, refreshToken, profile, done)
    )
);

// Configure GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        githubStrategy.getStrategyConfig(),
        (accessToken, refreshToken, profile, done) =>
            githubStrategy.authenticate(accessToken, refreshToken, profile, done)
    )
);

// Configure Facebook OAuth Strategy
passport.use(
    new FacebookStrategy(
        facebookStrategy.getStrategyConfig(),
        (accessToken, refreshToken, profile, done) =>
            facebookStrategy.authenticate(accessToken, refreshToken, profile, done)
    )
);

passport.serializeUser((user, done) => {
    done(null, user.account_id); // determine what data to store in the session (cookie)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;