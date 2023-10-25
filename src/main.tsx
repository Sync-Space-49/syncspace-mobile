import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import { domain as auth0Domain, clientId, callbackUri } from "./auth.config";

// const domain = process.env.REACT_APP_AUTH0_DOMAIN;
// const clientId = process.env.REACT_APP_AUTH0_FRONTEND_CLIENT_ID;
// const redirect_uri = process.env.REACT_APP_REDIRECT_URI

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUri
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)g