import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
} from "@ionic/react";
import { useState } from "react";
import "./MyOrgs.css";
import CustomList from "../components/CustomList";

const MyOrgs: React.FC = () => {
  const [showCustomList, setShowCustomList] = useState(false);

  const handleButtonClick = () => {
    setShowCustomList(!showCustomList);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Organizations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Organizations</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar></IonSearchbar>

        <CustomList
          title="My Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[{ text: "Laundry Room remodel" }, { text: "Garden" }]}
        />

        {showCustomList && (
          <CustomList
            title="SyncSpace's Boards"
            titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
            items={[
              { text: "Frontend" },
              { text: "Mobile" },
              { text: "Backend" },
            ]}
          />
        )}

        {/* <CustomList
          title="ACM-W's Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[{ text: "Axe-Hacks" }, { text: "Fall '23" }]}
        /> */}

        <div className="button">
          <IonButton shape="round" onClick={handleButtonClick}>
            + Add Organization
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyOrgs;
