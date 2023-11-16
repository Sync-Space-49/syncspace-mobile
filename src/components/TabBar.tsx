import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { home, layersOutline, personCircleOutline } from "ionicons/icons";
import Home from "../pages/Home";
import MyOrgs from "../pages/MyOrgs";
import Profile from "../pages/Profile";
import Organization from "../pages/Organization";

import Board from "../pages/Board";

const TabBar: React.FC = () => {
  return (
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/app" to="/app/home" />
          <Route exact path="/app/home">
            <Home />
          </Route>
          <Route exact path="/app/myorgs">
            <MyOrgs />
          </Route>
          <Route exact path="/app/profile">
            <Profile />
          </Route>
          <Route path="/app/board" component={Board} />
          <Route exact path="/app/organization" component={Organization} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="Home" href="/app/home">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="My Organizations" href="/app/myorgs">
            <IonIcon aria-hidden="true" icon={layersOutline} />
            <IonLabel>My Orgs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Profile" href="/app/profile">
            <IonIcon aria-hidden="true" icon={personCircleOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
  );
};

export default TabBar;
