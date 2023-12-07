import { isPlatform } from "@ionic/react";

export const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN;
export const clientId = import.meta.env.VITE_REACT_APP_AUTH0_FRONTEND_CLIENT_ID;
export const serverAdress = import.meta.env.VITE_REACT_APP_SERVER_ADDRESS;
export const secret = import.meta.env.VITE_REACT_APP_AUTH0_FRONTEND_CLIENT_SECRET;
export const serverAudience = import.meta.env.VITE_REACT_APP_SERVER_AUDIENCE;

const appId = "com.syncspace.syncspace";

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain;
const iosOrAndroid = isPlatform('hybrid');

export const callbackUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
  : `${window.location.origin}/app`;