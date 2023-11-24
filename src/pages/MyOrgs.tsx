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
  IonItem,
  IonList,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { addOutline, colorWandOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "./MyOrgs.css";
import SpecificOrganization from "../components/SpecificOrganization";
import { useAuth0 } from "@auth0/auth0-react";
import { serverAdress } from "../auth.config";
import axios from "axios";

import type { Organization } from "../types";

const MyOrgs: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  // const [present, dismiss] = useIonLoading();
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
    const orgId = '1234';
    history.push(`/app/organizations/${orgId}`); 
    setPopoverState({ showPopover: false, event: undefined });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getOrganizations();
    event.detail.complete();
  };

  const getOrganizations = async () => {
    // present();
    let token = await getAccessTokenSilently();
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}api/users/${userId}/organizations`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const userOrganizations = response.data;
        setOrganizations(userOrganizations);
        // dismiss();
      })
      .catch((error) => {
        console.log(error.message);
        // dismiss();
      });
  };

  const createOrganization = async (title: string, description: string) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (title) {
      body.append("title", title);
    }
    if (description) {
      body.append("description", description);
    }
    console.log("Sending data:", body);

    const options = {
      method: "POST",
      url: `${serverAdress}api/organizations`,
      headers: { authorization: `Bearer ${token}` },
      data: body,
    };

    await axios(options)
      .then(async () => {
        console.log("success, org created");
        await getAccessTokenSilently().then(() => {
          getOrganizations();
        });
      })
      .catch((error) => {
        console.error(
          "ERROR: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const updateOrgList = () => {
    getOrganizations();
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
              <IonButton id="click-trigger">
                <IonIcon slot="icon-only" icon={addOutline} />
              </IonButton>
            </IonButtons>
            <IonPopover trigger="click-trigger" triggerAction="click">
            <IonList>
              <IonItem button={true} detail={false} onClick={handleCreateOrganization} lines="none">
                Create a new organization
              </IonItem>
            </IonList>
            </IonPopover>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar></IonSearchbar>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {organizations && organizations.length > 0 ? (
          organizations.map((organization, i) => {
            return <SpecificOrganization org={organization} updateOrgList={updateOrgList} key={i} />;
          })
        ) : (
          <h1 className="ion-padding">No organizations were found</h1>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyOrgs;
