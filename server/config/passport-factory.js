import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import db from '../models/index.js';
import { OAuthStrategyFactory } from "../services/OAuthStrategyFactory.js";
import dotenv from "dotenv";

dotenv.config();

// Map of provider names to their corresponding Passport strategy classes
const strategyClasses = {
    google: GoogleStrategy,
    github: GitHubStrategy,
    facebook: FacebookStrategy
};

/**
 * Configure OAuth strategies using the factory pattern
 * @param {string[]} providers - Array of provider names to configure
 */
function configureOAuthStrategies(providers = ['google', 'github', 'facebook']) {
    providers.forEach(providerName => {
        try {
            // Create strategy instance using factory
            const oauthStrategy = OAuthStrategyFactory.createStrategy(providerName);
            const StrategyClass = strategyClasses[providerName];
            
            if (!StrategyClass) {
                console.warn(`Passport strategy class not found for provider: ${providerName}`);
                return;
            }

            // Configure passport strategy
            passport.use(
                new StrategyClass(
                    oauthStrategy.getStrategyConfig(),
                    (accessToken, refreshToken, profile, done) =>
                        oauthStrategy.authenticate(accessToken, refreshToken, profile, done)
                )
            );

            console.log(`${providerName} OAuth strategy configured successfully`);
        } catch (error) {
            console.error(`Failed to configure ${providerName} OAuth strategy:`, error.message);
        }
    });
}

// Configure all OAuth strategies
configureOAuthStrategies();

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
