import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";

import TabBar from "./components/TabBar";
// import AppUrlListener from './components/AppUrlListener';

import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";


import { callbackUri, serverAdress, domain, clientId, secret } from "./auth.config";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Pages */
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Organization from "./pages/Organization";
import Callback from "./components/Callback";
// import Error from './pages/Error';

setupIonicReact();

const App: React.FC = () => {
  
  // const options = { method: 'POST', 
  //   url: `${domain}/oauth/token`,
  //   headers: { 'content-type': 'application/json' },
  //   body: `{"client_id":"${clientId}, "client_secret":${secret},"audience":"127.0.0.1:8080","grant_type":"client_credentials"}`};
  
  // request(options, function(error, response, body) ) {
    //   if (error) throw new Error(error);
    // }
    // }

    const options = {
      method: "GET",
      url: `${serverAdress}`,
      headers: { "authorization": "Bearer TOKEN" },
    };

    axios(options)
      .then(response => {
        console.log(response.data); //debug
      })
      .catch(error => {
        console.log(error);
      });
    
    // Get the callback handler from the Auth0 React hook
    const { handleRedirectCallback } = useAuth0();

  useEffect(() => {
    // Handle the 'appUrlOpen' event and call `handleRedirectCallback`
    CapApp.addListener("appUrlOpen", async ({ url }) => {
      if (url.startsWith(callbackUri)) {
        if (
          url.includes("state") &&
          (url.includes("code") || url.includes("error"))
        ) {
          const res = await fetch(`${serverAdress}`);
          const data = await res.json();
          await handleRedirectCallback(url);          
        }
        // No-op on Android
        await Browser.close();
      }
    });
  }, [handleRedirectCallback]);

  // console.log("app is rendering");
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={LandingPage} />
          <Redirect exact from={callbackUri} to="/app" />
          <Route path="/app" component={TabBar} />
          <Route exact path="/app/home" component={Home} />
          <Route exact path="/app/organization" component={Organization} />
          {/* <Route exact path="/error" component={Error} /> */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
