import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
} from "@ionic/react";
// import ExploreContainer from '../components/ExploreContainer';
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
          imgSrc="/icons/SyncSpace-mint.png"
          items={["Frontend", "Mobile", "Backend"]}
        />

        <CustomList
          title="My Boards"
          imgSrc="/icons/SyncSpace-mint.png"
          items={["Laundry Room remodel", "Garden"]}
        />

        <CustomList
          title="ACM-W's Boards"
          imgSrc="/icons/SyncSpace-mint.png"
          items={["Axe-Hacks", "Fall '23"]}
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
