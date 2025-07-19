import { GoogleOAuthStrategy, GitHubOAuthStrategy, FacebookOAuthStrategy } from './OAuthStrategies.js';

/**
 * Factory class for creating OAuth strategy instances
 */
export class OAuthStrategyFactory {
    static strategies = new Map([
        ['google', GoogleOAuthStrategy],
        ['github', GitHubOAuthStrategy],
        ['facebook', FacebookOAuthStrategy]
    ]);

    /**
     * Create an OAuth strategy instance
     * @param {string} provider - The OAuth provider name
     * @returns {OAuthStrategy} Strategy instance
     * @throws {Error} If provider is not supported
     */
    static createStrategy(provider) {
        const StrategyClass = this.strategies.get(provider.toLowerCase());
        if (!StrategyClass) {
            throw new Error(`OAuth provider '${provider}' is not supported. Supported providers: ${Array.from(this.strategies.keys()).join(', ')}`);
        }
        return new StrategyClass();
    }

    /**
     * Get all supported OAuth providers
     * @returns {string[]} Array of supported provider names
     */
    static getSupportedProviders() {
        return Array.from(this.strategies.keys());
    }

    /**
     * Register a new OAuth strategy
     * @param {string} provider - Provider name
     * @param {Class} StrategyClass - Strategy class constructor
     */
    static registerStrategy(provider, StrategyClass) {
        this.strategies.set(provider.toLowerCase(), StrategyClass);
    }

    /**
     * Check if a provider is supported
     * @param {string} provider - Provider name to check
     * @returns {boolean} True if provider is supported
     */
    static isProviderSupported(provider) {
        return this.strategies.has(provider.toLowerCase());
    }
}
