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
            { text: "Mobile", listImg: "/icons/SyncSpace-mint.png" },
            { text: "Axe-Hacks", listImg: "/icons/SyncSpace-mint.png" },
            { text: "Fall'23", listImg: "/icons/SyncSpace-mint.png" },
          ]}
        />

        <CustomList
          title="Recent Activity"
          subTitle="Today"
          items={[
            {
              text: "Dylan created a new ticket: “Modify AI Models”",
              listImg: "/icons/SyncSpace-mint.png",
            },
            {
              text: "Sumi marked “Create flyers for Axe-Hacks” as completed",
              listImg: "/icons/SyncSpace-mint.png",
            },
            {
              text: "Tyler deleted “[SPIKE] Research AI”",
              listImg: "/icons/SyncSpace-mint.png",
            },
          ]}
        />

        <CustomList
          subTitle="Yesterday"
          items={[
            {
              text: "Nathan edited “Add Account Functionality”",
              listImg: "/icons/SyncSpace-mint.png",
            },
            {
              text: "Kaitlyn commented “Should we use React?”",
              listImg: "/icons/SyncSpace-mint.png",
            },
            {
              text: "MJ marked “Update Github README” as in-progress",
              listImg: "/icons/SyncSpace-mint.png",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
