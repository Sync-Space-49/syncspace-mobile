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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { addOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "./MyOrgs.css";
import SpecificOrganization from "../components/SpecificOrganization";
import { useAuth0 } from "@auth0/auth0-react";
import { serverAdress } from "../auth.config";
import axios from "axios";

import type { Organization } from "../types"

const MyOrgs: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [present, dismiss] = useIonLoading();
  const [organizations, setOrganizations] = useState<Organization[]>();

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
    console.log("org created");
    history.push("/app/organization");
    setPopoverState({ showPopover: false, event: undefined });
  };


  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getOrganizations();
    event.detail.complete();
  }

  const getOrganizations = async () => {
    present();
    let token = await getAccessTokenSilently();
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}api/users/${userId}/organizations`,
      headers: { authorization: `Bearer ${token}` },
    };

    axios(options)
      .then((response) => {
        const userOrganizations = response.data;
        setOrganizations(userOrganizations)
        dismiss();
      })
      .catch((error) => {
        console.log(error);
        dismiss();
      });
  }

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Organizations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent>
          </IonRefresherContent>
        </IonRefresher>
        {organizations ? (organizations.map((organization, i) => {
          return <SpecificOrganization org={organization} key={i} />
        })) : (<h1 className="ion-padding">No organizations were found</h1>)}
      </IonContent>
    </IonPage>
  );
};

export default MyOrgs;
