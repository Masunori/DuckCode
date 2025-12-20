import OAuthProviderFactory from '../factories/OAuthProviderFactory.js';

const oauthService = {
  async handleOAuthSuccess(profile, provider) {
    try {
      // Validate inputs
        if (!profile) {
            throw new Error("OAuth profile data is required");
        }
      
        if (!provider) {
            throw new Error("OAuth provider name is required");
        }
        
        // Log for debugging
        // console.log(`Processing OAuth login for provider: ${provider}`);
        
        // Create provider instance through factory
        const oauthProvider = OAuthProviderFactory.createProvider(provider);
        // console.log(`Using provider instance: ${oauthProvider.constructor.name}`);
        try {
            const userData = await oauthProvider.processOAuthProfile(profile);
            // console.log(`OAuth processing successful for provider: ${provider}`);
            return userData;
        } catch (processingError) {
            // console.error(`Error processing OAuth profile: ${processingError.message}`);
            // console.error(processingError.stack);
            throw new Error(`Failed to process ${provider} profile: ${processingError.message}`);
        }
    } catch (error) {
      console.error(`OAuth ${provider || 'unknown'} authentication error:`, error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  },
};

export default oauthService;