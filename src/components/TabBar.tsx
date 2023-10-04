import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import Home from "../pages/Home";
import MyBoards from "../pages/MyBoards";
import MyOrgs from "../pages/MyOrgs";
import Profile from "../pages/Profile";


interface ContainerProps {
    name: string;
  }

  const name = "temp"; // please fix this later, only prop needed is which tab it's currently on
const TabBar: React.FC<ContainerProps> = ({ name }) => {
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
                <MyOrgs />
            </Route>
            <Route exact path="/">
                <Redirect to="/home" />
            </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
            <IonTabButton tab="Home" href="/home">
                <IonIcon name="home-outline"/> 
                <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="My Boards" href="/myboards">
                <IonIcon name="home-outline"/> 
                <IonLabel>My Boards</IonLabel>
            </IonTabButton>
            <IonTabButton tab="My Organizations" href="/myorgs">
                <IonIcon name="home-outline"/> 
                <IonLabel>My Organizations</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Profile" href="/profile">
                <IonIcon name="person-circle-outline"/> 
                <IonLabel>Profile</IonLabel>
            </IonTabButton>
            </IonTabBar>
        </IonTabs>
        </IonReactRouter>
    );
};

export default TabBar;