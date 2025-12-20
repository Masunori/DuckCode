// Fix the import - use the correct path
import  GoogleOAuthProvider  from "../providers/GoogleOauthProvider.js";
class OAuthProviderFactory {
  static createProvider(providerName) {
    if (!providerName) {
      throw new Error("Provider name is required");
    }
    
    console.log(`Creating provider for: ${providerName}`);
    
    switch(providerName.toLowerCase()) {
      case 'google':
        console.log("Creating Google OAuth provider");
        return new GoogleOAuthProvider();
      // Other cases...
      case 'github':
        console.log("Creating Github OAuth provider");
        return new GithubOAuthProvider();
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  }
}

export default OAuthProviderFactory;