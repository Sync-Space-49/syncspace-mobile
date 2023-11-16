import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { callbackUri, clientId, domain, serverAudience } from "./auth.config";

export const Auth0ProviderWithHistory = ({ children }:any) => {
    const history = useHistory();

    const onRedirectCallback = (appState:any) => {
        history.push(appState?.returnTo || window.location.pathname);
    };

    if (!(domain && clientId)) {
        return null;
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: callbackUri,
                audience: serverAudience,
                scope: "openid profile email offline_access"
            }}
            onRedirectCallback={onRedirectCallback}
            useRefreshTokens={true}
            useRefreshTokensFallback={true}
        >
            {children}
        </Auth0Provider>
    );
};
