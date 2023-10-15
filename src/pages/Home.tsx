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
// import ExploreContainer from '../components/ExploreContainer';
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
          items={["Mobile", "Axe-Hacks", "Fall'23"]}
        />

        <CustomList
          title="Recent Activity"
          subTitle="Today"
          items={[
            "Dylan created a new ticket: “Modify AI Models”",
            "Sumi marked “Create flyers for Axe-Hacks” as completed",
            "Tyler deleted “[SPIKE] Research AI”",
          ]}
        />

        <CustomList
          subTitle="Yesterday"
          items={[
            "Nathan edited “Add Account Functionality”",
            "Kaitlyn commented “Should we use React?”",
            "MJ marked “Update Github README” as in-progress",
          ]}
        />

        {/* An example of old list implementation in case we need to go back (but look at how much neater components are <3) */}
        {/* <div className="list-title">Quick Access</div>
        <IonList inset={true}>
          <IonItem>
            <IonLabel>Mobile</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Axe-Hacks</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Fall '23</IonLabel>
          </IonItem>
        </IonList> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
