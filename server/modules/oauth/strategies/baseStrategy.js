import db from '../../../models/index.js';
import { Op } from 'sequelize';
import config from '../../../config/index.js';
import { webcrypto as crypto } from 'node:crypto';
import oauthService from '../services/oauthService.js';

class OAuthStrategies {
    constructor({ provider, ClassStrategy, config}) {
        this.provider = provider;
        this.ClassStrategy = ClassStrategy;
        this.config = config;
    }
    async verify(accessToken, refreshToken, profile, done) {
        try {
            const result = await oauthService.handleOAuthSuccess(profile, this.provider);
            return done(null, result);
        } catch(error) {
            console.error(`[${this.provider} OAuth] Error:`, error);
            return done(error);
        }
    }
    createStrategy() {
        return new this.ClassStrategy(
            this.config,
            this.verify.bind(this)
        );
    }
}

export default OAuthStrategies;