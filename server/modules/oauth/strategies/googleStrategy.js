import OAuthStrategy from "./baseStrategy.js";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
class GoogleOAuthStrategy extends OAuthStrategy {
    constructor(config) {
        super({
            provider: "google",
            ClassStrategy: GoogleStrategy,
            config: {
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: config.callbackURL
            }
            // console.log('Google OAuth config:', config.callbackURL);
        });
        console.log('Google OAuth config:', config.callbackURL);    
    }
}

export default GoogleOAuthStrategy;