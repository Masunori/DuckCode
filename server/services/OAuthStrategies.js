import { OAuthStrategy } from './OAuthStrategy.js';
import dotenv from "dotenv";

dotenv.config();

/**
 * Google OAuth Strategy implementation
 */
export class GoogleOAuthStrategy extends OAuthStrategy {
    constructor() {
        super("google");
    }

    /**
     * Get Google OAuth strategy configuration
     * @returns {Object} Google strategy configuration
     */
    getStrategyConfig() {
        return {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback"
        };
    }

    /**
     * Extract user data from Google profile
     * @param {Object} profile - Google profile object
     * @param {string} accessToken - Google access token
     * @returns {Object} Normalized user data
     */
    async extractUserData(profile, accessToken) {
        const email = profile.emails?.[0]?.value || null;
        const provider_id = profile.id;
        const username = profile.displayName;

        return {
            provider_id,
            username,
            email: this.handleMissingEmail(email, username)
        };
    }
}

/**
 * GitHub OAuth Strategy implementation
 */
export class GitHubOAuthStrategy extends OAuthStrategy {
    constructor() {
        super("github");
    }

    /**
     * Get GitHub OAuth strategy configuration
     * @returns {Object} GitHub strategy configuration
     */
    getStrategyConfig() {
        return {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/github/callback",
            scope: ['user:email'] // Request user's email
        };
    }

    /**
     * Extract user data from GitHub profile
     * @param {Object} profile - GitHub profile object
     * @param {string} accessToken - GitHub access token
     * @returns {Object} Normalized user data
     */
    async extractUserData(profile, accessToken) {
        const provider_id = profile.id;
        const username = profile.username || profile.displayName;
        let email = profile.emails?.[0]?.value || null;

        // If email is not available in profile, fetch it from GitHub API
        if (!email) {
            try {
                const response = await fetch("https://api.github.com/user/emails", {
                    headers: { Authorization: `token ${accessToken}` },
                });
                const emails = await response.json();
                email = emails.find(e => e.primary && e.verified)?.email || null;
                console.log("GitHub email fetched manually:", email ? "success" : "failed");
            } catch (error) {
                console.warn("Failed to fetch GitHub email:", error.message);
            }
        }

        return {
            provider_id,
            username,
            email: this.handleMissingEmail(email, username)
        };
    }
}

/**
 * Facebook OAuth Strategy implementation
 */
export class FacebookOAuthStrategy extends OAuthStrategy {
    constructor() {
        super("facebook");
    }

    /**
     * Get Facebook OAuth strategy configuration
     * @returns {Object} Facebook strategy configuration
     */
    getStrategyConfig() {
        return {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/facebook/callback",
            profileFields: ["id", "displayName", "email"] // Ensure email is retrieved
        };
    }

    /**
     * Extract user data from Facebook profile
     * @param {Object} profile - Facebook profile object
     * @param {string} accessToken - Facebook access token
     * @returns {Object} Normalized user data
     */
    async extractUserData(profile, accessToken) {
        const provider_id = profile.id;
        const username = profile.displayName;
        const email = profile.emails?.[0]?.value || null;

        return {
            provider_id,
            username,
            email: this.handleMissingEmail(email, username)
        };
    }
}
