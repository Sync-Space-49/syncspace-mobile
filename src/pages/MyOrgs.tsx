import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
} from "@ionic/react";
import "./MyOrgs.css";
import CustomList from "../components/CustomList";

const MyOrgs: React.FC = () => {
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
          title="SyncSpace's Boards"
          titleImg="/icons/SyncSpace-mint.png"
          items={[
            { text: "Frontend" },
            { text: "Mobile" },
            { text: "Backend" },
          ]}
        />

        <CustomList
          title="My Boards"
          titleImg="/icons/SyncSpace-mint.png"
          items={[{ text: "Laundry Room remodel" }, { text: "Garden" }]}
        />

        <CustomList
          title="ACM-W's Boards"
          titleImg="/icons/SyncSpace-mint.png"
          items={[{ text: "Axe-Hacks" }, { text: "Fall '23" }]}
        />
        <div className="button">
          {/* Does having this make sense? Don't we already have a '+' button at the very top? */}
          <IonButton shape="round">+ Add Organization</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyOrgs;
