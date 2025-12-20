import oauthService from '../services/oauthService.js';
const base_url = process.env.FRONTEND_URL || 'http://localhost:4200';
const oauthController = { 
  // Google OAuth callback
  // In oauthController.js
  googleCallback: async (req, res) => {
    try {
      const profile = req.user;
      console.log('Google profile [CALLBACK]:', profile);
      if (profile && profile.token.accessToken && profile.token.refreshToken) {
        // console.log("HAHAHAHAHA");
        const result = profile;
        const redirectUrl = `${base_url}/auth/callback?accessToken=${encodeURIComponent(profile.token.accessToken)}&refreshToken=${encodeURIComponent(profile.token.refreshToken)}`;
        console.log('Redirecting to:', redirectUrl);
        console.log('Google OAuth successful, tokens set in cookies');
        return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Completing Authentication...</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: system-ui, -apple-system, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .loader {
              text-align: center;
            }
            .spinner {
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top: 4px solid white;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loader">
            <div class="spinner"></div>
            <p>Completing authentication...</p>
          </div>
          <form id="tokenForm" method="POST" action="${base_url}/api/auth/oauth-callback" style="display: none;">
            <input type="hidden" name="accessToken" value="${result.token.accessToken}" />
            <input type="hidden" name="refreshToken" value="${result.token.refreshToken}" />
            <input type="hidden" name="provider" value="github" />
          </form>
          <script>
            document.getElementById('tokenForm').submit();
          </script>
        </body>
        </html>
      `);
      }      
    } catch (error) {
      console.error('Google OAuth error:', error);
      return res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
  },
  
  // Facebook OAuth callback
  facebookCallback: async (req, res) => {
    try {
      const profile = req.user;
      const result = await oauthService.handleOAuthSuccess(profile, 'facebook');
      
      // Handle tokens
      res.cookie('accessToken', result.accessToken, { httpOnly: true });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
      return res.redirect(`${process.env.FRONTEND_URL}/login/success`);
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login/error`);
    }
  },
  
  // GitHub OAuth callback
  githubCallback: async (req, res) => {
    try {
      const profile = req.user;
      const result = await oauthService.handleOAuthSuccess(profile, 'github');
      
      // Handle tokens
      res.cookie('accessToken', result.token.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1000 * 60 * 60 // 1 hour
      });
      res.cookie('refreshToken', result.token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      });

      return res.status(200).json({ message: 'Login successful', data: result.token });
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
  }
};

export default oauthController;