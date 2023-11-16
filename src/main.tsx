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
import { IonReactRouter } from "@ionic/react-router";
import { Auth0ProviderWithHistory } from "./auth0-provider-with-navigate"; 

const container = document.getElementById("root");
const root = createRoot(container!);

// onRedirectCallback?: (appState?: AppState, user?: User) => void;

root.render(
  <IonReactRouter>
    {/* <Auth0Provider
      domain={auth0Domain!}
      clientId={clientId!}
      authorizationParams={{
        redirect_uri: callbackUri,
        audience: serverAudience,
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      // onRedirectCallback={}
    > */}
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
    {/* </Auth0Provider> */}
  </IonReactRouter>
);
