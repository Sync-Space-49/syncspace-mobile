import { isPlatform } from "@ionic/react";

export const domain = process.env.REACT_APP_AUTH0_DOMAIN;
export const clientId = process.env.REACT_APP_AUTH0_FRONTEND_CLIENT_ID;
export const serverAdress = process.env.REACT_APP_SERVER_ADDRESS;
export const secret = process.env.REACT_APP_AUTH0_FRONTEND_CLIENT_SECRET;
export const serverAudience = process.env.REACT_APP_SERVER_AUDIENCE;

const appId = "com.app.syncspace";

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain;
const iosOrAndroid = isPlatform('hybrid');

export const callbackUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
  : 'http://localhost:8100/callback';