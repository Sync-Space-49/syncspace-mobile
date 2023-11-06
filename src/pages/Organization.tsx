import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonPopover,
} from "@ionic/react";
import CustomList from "../components/CustomList";
import { useState } from "react";
import { addOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "./Organization.css";

const Organization: React.FC = () => {
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
    console.log("board created");
    history.push("/app/board");
    setPopoverState({ showPopover: false, event: undefined });
    //redirect "create with AI to AI tour"
  };

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
                <div className="ion-padding">
                  <button
                    onClick={handleCreateOrganization}
                    className="create-org-btn"
                  >
                    Create a New Board
                  </button>
                </div>
                <div className="separator-line"></div>
                <div className="ion-padding">
                  <button
                    onClick={handleCreateOrganization}
                    className="create-org-btn"
                  >
                    Create a New Board with AI
                  </button>
                </div>
              </IonContent>
            </IonPopover>
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
