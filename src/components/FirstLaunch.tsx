import { IonButton, IonContent } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { browsersOutline, home, layersOutline, personCircleOutline } from "ionicons/icons";


const FirstLaunch: React.FC = () => {
    return (
        <IonContent className="ion-padding">
            <h1>Welcome to SyncSpace!</h1>
            <IonButton color="primary" href="">Ready to launch?</IonButton>
        </IonContent>
    );
};

export default FirstLaunch;