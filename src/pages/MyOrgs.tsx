import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonButtons,
  IonPopover,
  IonIcon,
} from "@ionic/react";
import { useState } from "react";
import "./MyOrgs.css";
import CustomList from "../components/CustomList";
import { addOutline } from "ionicons/icons";
import { useHistory } from "react-router";

const MyOrgs: React.FC = () => {
  // const [showCustomList, setShowCustomList] = useState(false);
  const [popoverState, setPopoverState] = useState<{
    showPopover: boolean;
    event: Event | undefined;
  }>({ showPopover: false, event: undefined });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.persist();
    setPopoverState({ showPopover: true, event: e.nativeEvent });
  };

  const history = useHistory();

  const handleCreateOrganization = () => {
    console.log("org and board created");
    history.push("/app/organization");
    setPopoverState({ showPopover: false, event: undefined });
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
            <IonButtons slot="end">
              <IonButton onClick={handleButtonClick} className="add-btn">
                <IonIcon slot="icon-only" icon={addOutline} />
              </IonButton>
            </IonButtons>
            <IonPopover
              isOpen={popoverState.showPopover}
              event={popoverState.event}
              onDidDismiss={() =>
                setPopoverState({ showPopover: false, event: undefined })
              }
            >
              <IonContent class="ion-padding">
                <button
                  onClick={handleCreateOrganization}
                  className="create-org-btn"
                >
                  Create a New Organization
                </button>
              </IonContent>
            </IonPopover>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar></IonSearchbar>

        <CustomList
          title="My Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[{ text: "Laundry Room remodel" }, { text: "Garden" }]}
        />

        <CustomList
          title="ACM-W's Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[{ text: "Axe-Hacks" }, { text: "Fall '23" }]}
        />

        <CustomList
          title="SyncSpace's Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={[
            { text: "Frontend" },
            { text: "Mobile" },
            { text: "Backend" },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default MyOrgs;
