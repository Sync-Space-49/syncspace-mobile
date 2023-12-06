import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route, RouteComponentProps } from "react-router";
import { home, layersOutline, personCircleOutline } from "ionicons/icons";
import Home from "../pages/Home";
import MyOrgs from "../pages/MyOrgs";
import Profile from "../pages/Profile";
import OrgDetail from "../pages/OrgDetail";

import Board from "../pages/Board";
import { match } from "react-router-dom";

const TabBar: React.FC<RouteComponentProps> = ({ match }) => {
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
          <Route exact path="/app/myorgs/organizations/:orgId" component={OrgDetail} />
          <Route exact path="/app/myorgs/organizations/:orgId/boards/:boardId" component={Board} />
          <Route exact path="/app/profile">
            <Profile />
          </Route>
          <Route exact path="/app/profile/organizations/:orgId" component={OrgDetail}/>
          <Route exact path={`/app/profile/organizations/:orgId/boards/:boardId`} component={Board}/>

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
