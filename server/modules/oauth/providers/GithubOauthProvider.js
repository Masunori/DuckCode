// Fix the import - use the correct path relative to this file
import BaseOAuthProvider  from "./BaseOAuthProvider.js";
class GithubOAuthProvider extends BaseOAuthProvider {
  constructor() {
    super('github'); // Call the parent constructor with 'github' provider name
  }
  
  extractUserInfo(profile) {
    console.log("Extracting user info from Github profile AT EXTRACT PHRASE:", profile);
    const email = profile.emails[0].value;
    console.log("Extracted email:", email);
    const username = profile.displayName;
    console.log("Extracted username:", username);
    const avatarUrl = profile.photos?.[0]?.value || null;
    const provider = 'github';
    console.log("Extracted avatar URL:", avatarUrl);
    return {
      email,
      username,
      avatarUrl,
      provider
    };
  }
}

// Export the class directly
export default GoogleOAuthProvider;