export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  redirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
  scope: 'openid profile email read:current_user',
};

// Validate that all required environment variables are present
export const validateAuth0Config = () => {
  const requiredVars = ['VITE_AUTH0_DOMAIN', 'VITE_AUTH0_CLIENT_ID'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required Auth0 environment variables:', missing);
    return false;
  }
  
  return true;
};
