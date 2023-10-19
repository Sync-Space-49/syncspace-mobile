import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";
import CustomList from "../components/CustomList";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSearchbar></IonSearchbar>

        <CustomList
          title="Quick Access"
          items={[
            { text: "Mobile", listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png" },
            { text: "Axe-Hacks", listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png" },
            { text: "Fall'23", listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png" },
          ]}
        />

        <CustomList
          title="Recent Activity"
          subTitle="Today"
          items={[
            {
              text: "Dylan created a new ticket: “Modify AI Models”",
              listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Sumi marked “Create flyers for Axe-Hacks” as completed",
              listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Tyler deleted “[SPIKE] Research AI”",
              listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
          ]}
        />

        <CustomList
          subTitle="Yesterday"
          items={[
            {
              text: "Nathan edited “Add Account Functionality”",
              listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Kaitlyn commented “Should we use React?”",
              listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "MJ marked “Update Github README” as in-progress",
              listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
