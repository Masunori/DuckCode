import passport from "passport";
import GoogleOAuthStrategy from "./strategies/googleStrategy.js";
import GithubOAuthStrategy from "./strategies/githubStrategy.js";
import config from "../../config/index.js";

if (config.oauth?.google?.clientID) {
    const googleStrategy = new GoogleOAuthStrategy({
        clientID: config.oauth.google.clientID,
        clientSecret: config.oauth.google.clientSecret,
        callbackURL: config.oauth.google.callbackURL
    });
    passport.use("google", googleStrategy.createStrategy());
}
if (config.oauth?.github?.clientID) {
    const githubStrategy = new GithubOAuthStrategy({
        clientID: config.oauth.github.clientID,
        clientSecret: config.oauth.github.clientSecret,
        callbackURL: config.oauth.github.callbackURL
    });
    passport.use("github", githubStrategy.createStrategy());
}
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;