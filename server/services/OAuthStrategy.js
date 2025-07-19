import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

/**
 * Abstract base class for OAuth authentication strategies
 */
export class OAuthStrategy {
    constructor(provider) {
        if (this.constructor === OAuthStrategy) {
            throw new Error("Cannot instantiate abstract class OAuthStrategy directly");
        }
        this.provider = provider;
    }

    /**
     * Abstract method to extract user profile data
     * Must be implemented by concrete strategy classes
     * @param {Object} profile - OAuth provider profile
     * @param {string} accessToken - OAuth access token
     * @returns {Object} Normalized user data
     */
    extractUserData(profile, accessToken) {
        throw new Error("extractUserData method must be implemented by concrete strategy");
    }

    /**
     * Abstract method to get strategy configuration
     * Must be implemented by concrete strategy classes
     * @returns {Object} Strategy configuration object
     */
    getStrategyConfig() {
        throw new Error("getStrategyConfig method must be implemented by concrete strategy");
    }

    /**
     * Common authentication callback logic
     * @param {string} accessToken - OAuth access token
     * @param {string} refreshToken - OAuth refresh token
     * @param {Object} profile - User profile from OAuth provider
     * @param {Function} done - Passport done callback
     */
    async authenticate(accessToken, refreshToken, profile, done) {
        try {
            const userData = await this.extractUserData(profile, accessToken);
            const { provider_id, username, email } = userData;

            // Check for existing user
            const existingUser = await db.User.findOne({
                where: {
                    providerId: provider_id,
                    provider: this.provider
                }
            });
            
            let user;
            if (!existingUser) {
                // Create new user
                user = await this.createNewUser(username, email, provider_id);
            } else {
                // Use existing user
                user = existingUser;
            }

            // Generate JWT token
            const token = this.generateToken(user);
            user.token = token;
            
            return done(null, user);
        } catch (error) {
            console.error(`${this.provider} authentication error:`, error);
            return done(error, null);
        }
    }

    /**
     * Create a new user in the database
     * @param {string} username - User's display name
     * @param {string} email - User's email address
     * @param {string} provider_id - Provider-specific user ID
     * @returns {Object} Created user object
     */
    async createNewUser(username, email, provider_id) {
        const newUser = await db.User.create({
            name: username,
            email: email,
            provider: this.provider,
            providerId: provider_id,
            password: '', // OAuth users don't need passwords
            exp: 0,
            rankPoint: 0,
            isAuthenticated: true, // OAuth users are pre-authenticated
            bio: '',
            isTwoFactored: false,
            profilePicture: ''
        });
        return newUser;
    }

    /**
     * Generate JWT token for authenticated user
     * @param {Object} user - User object from database
     * @returns {string} JWT token
     */
    generateToken(user) {
        return jwt.sign(
            {
                userId: user.account_id,
                username: user.username,
                email: user.email,
                rankPoints: user.rankPoints || 0,
                level: user.level || 1,
                experiencePoint: user.exp || 0
            },
            process.env.JWT_SECRET,
            { expiresIn: "36h" }
        );
    }

    /**
     * Handle cases where email is not provided by OAuth provider
     * @param {string} email - Initial email value
     * @param {string} username - Username as fallback
     * @returns {string} Email or fallback value
     */
    handleMissingEmail(email, username) {
        if (!email) {
            console.warn(`${this.provider} did not provide an email for user: ${username}`);
            return null;
        }
        return email;
    }
}
