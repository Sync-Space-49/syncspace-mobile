import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_FRONTEND_CLIENT_ID;
const authorizationParams = process.env.REACT_APP_AUTHORIZATION_PARAMS

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Auth0Provider
    // domain="{domain}"
    // clientId="{clientId}"
    domain={domain}
    clientId={clientId}
    useRefreshTokens={true}
    useRefreshTokensFallback={false}
    authorizationParams={authorizationParams}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
   </Auth0Provider>
)