import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
} from "@ionic/react";
import "./Organization.css";
import CustomList from "../components/CustomList";

const Organization: React.FC = () => {
  console.log("rendering organization");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Organization</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Organization</IonTitle>
          </IonToolbar>
        </IonHeader>
        <CustomList
          title="SyncSpace's Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[
            { text: "Frontend" },
            { text: "Mobile" },
            { text: "Backend" },
          ]}
        />
        <CustomList
          title="SyncSpace's Hidden Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[{ text: "Hiring Team" }, { text: "Admin Board" }]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Organization;
