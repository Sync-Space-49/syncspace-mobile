import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { browsersOutline, home, layersOutline, personCircleOutline } from "ionicons/icons";
import Home from "../pages/Home";
import MyBoards from "../pages/MyBoards";
import MyOrgs from "../pages/MyOrgs";
import Profile from "../pages/Profile";

const TabBar: React.FC = () => {
    return (
        <IonReactRouter>
        <IonTabs>
            <IonRouterOutlet>
            <Route exact path="/home">
                <Home />
            </Route>
            <Route exact path="/myboards">
                <MyBoards />
            </Route>
            <Route exact path="/myorgs">
                <MyOrgs />
            </Route>
            <Route exact path="/profile">
                <Profile />
            </Route>
            <Route exact path="/">
                <Redirect to="/home" />
            </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
            <IonTabButton tab="Home" href="/home">
                <IonIcon aria-hidden="true" icon={home} />
                <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="My Boards" href="/myboards">
                <IonIcon aria-hidden="true" icon={browsersOutline} />
                <IonLabel>My Boards</IonLabel>
            </IonTabButton>
            <IonTabButton tab="My Organizations" href="/myorgs">
                <IonIcon aria-hidden="true" icon={layersOutline} />
                <IonLabel>My Orgs</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Profile" href="/profile">
                <IonIcon aria-hidden="true" icon={personCircleOutline} />  
                <IonLabel>Profile</IonLabel>
            </IonTabButton>
            </IonTabBar>
        </IonTabs>
        </IonReactRouter>
    );
};

export default TabBar;