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
  IonToast,
} from "@ionic/react";
import CustomList from "../components/CustomList";
import "./Home.css";
import { useAuth0 } from "@auth0/auth0-react";

const Home: React.FC = () => {

  const { isLoading, isAuthenticated } = useAuth0();


  if (isLoading) {
    return null;
  }

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
        
        <div className="container">
          {isAuthenticated ? <IonToast message="You were successfully signed in!" duration={3000}/> : <IonToast message="You are not signed in." />}
        </div>
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
