import OAuthStrategy from "./baseStrategy.js";
import { Strategy as GitHubStrategy } from "passport-github2";
class GithubOAuthStrategy extends OAuthStrategy {
    constructor(config) {
        super({
            provider: "github",
            ClassStrategy: GitHubStrategy,
            config: {
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: config.callbackURL
            }
        });
    }
}

export default GithubOAuthStrategy;