import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import {
  domain as auth0Domain,
  clientId,
  callbackUri,
  serverAudience,
} from "./auth.config";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <Auth0Provider
    domain={auth0Domain!}
    clientId={clientId!}
    authorizationParams={{
      redirect_uri: callbackUri,
      audience: serverAudience,
    }}
    useRefreshTokens={true}
    useRefreshTokensFallback={false}
  >
    <App />
  </Auth0Provider>,
);
