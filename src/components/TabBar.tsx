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
                <Route exact path="/app/home">
                    <Home />
                </Route>
                <Route exact path="/app/myboards">
                    <MyBoards />
                </Route>
                <Route exact path="/app/myorgs">
                    <MyOrgs />
                </Route>
                <Route exact path="/app/profile">
                    <Profile />
                </Route>
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
        </IonReactRouter>
    );
};

export default TabBar;