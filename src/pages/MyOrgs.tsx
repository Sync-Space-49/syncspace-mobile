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
  IonItem,
  IonList,
  IonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { addOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import "./MyOrgs.css";
import SpecificOrganization from "../components/SpecificOrganization";
import { useAuth0 } from "@auth0/auth0-react";
import { serverAdress } from "../auth.config";
import axios from "axios";

import type { Organization } from "../types";

const MyOrgs: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const history = useHistory();
  const [organizations, setOrganizations] = useState<Organization[]>();
  const [showAlert, setShowAlert] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleCreateOrganization = () => {
    setShowAlert(true);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    let token = await getAccessTokenSilently();
    getOrganizations(token);
    event.detail.complete();
  };

  const getOrganizations = async (newToken?: string) => {
    if (newToken) {
      const userId = user!.sub;
      const options = {
        method: "GET",
        url: `${serverAdress}/api/users/${userId}/organizations`,
        headers: { authorization: `Bearer ${newToken}` },
      };

      await axios(options)
        .then((response) => {
          // console.log("newtoken");
          const userOrganizations = response.data;
          setOrganizations(userOrganizations);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      let token = await getAccessTokenSilently();
      // console.log("old token");
      const userId = user!.sub;
      const options = {
        method: "GET",
        url: `${serverAdress}/api/users/${userId}/organizations`,
        headers: { authorization: `Bearer ${token}` },
      };

      await axios(options)
        .then((response) => {
          const userOrganizations = response.data;
          setOrganizations(userOrganizations);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
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
    const options = {
      method: "POST",
      url: `${serverAdress}/api/organizations`,
      headers: { authorization: `Bearer ${token}` },
      data: body,
    };

    await axios(options)
      .then(async (response) => {
        console.log("success, org created, response: ", response);
        const orgId = response.data.id;
        // console.log("orgId: ", orgId);

        await getAccessTokenSilently().then((token) => {
          getOrganizations(token);
        });
        // history.push(`/app/myorgs/organizations/${orgId}`);
        setIsPopoverOpen(false);
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
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <IonPage>
      {/* <IonToolbar>
        <IonTitle>My Organizations</IonTitle>
      </IonToolbar> */}
      {/* </IonHeader> */}
      {/* <IonHeader collapse="condense"> */}

      <IonHeader collapse="condense">
        <IonToolbar></IonToolbar>
        <IonToolbar>
          <IonTitle size="large">My Organizations</IonTitle>
          <IonButtons slot="end">
            <IonButton
              id="click-trigger"
              onClick={() => setIsPopoverOpen(true)}
            >
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonPopover
          isOpen={isPopoverOpen}
          onDidDismiss={() => setIsPopoverOpen(false)}
          trigger="click-trigger"
          triggerAction="click"
        >
          <IonList>
            <IonItem
              button={true}
              detail={false}
              onClick={handleCreateOrganization}
            >
              Create a new organization
            </IonItem>
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header="Please enter your organization details"
              buttons={[
                {
                  text: "Finish",
                  handler: (alertData) => {
                    const title = alertData.title;
                    const description = alertData.description;
                    createOrganization(title, description);
                  },
                },
              ]}
              inputs={[
                {
                  name: "title",
                  placeholder: "Title",
                },
                {
                  name: "description",
                  type: "textarea",
                  placeholder: "Description",
                },
              ]}
            />
          </IonList>
        </IonPopover>
        <IonSearchbar></IonSearchbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {organizations && organizations.length > 0 ? (
          organizations.map((organization, i) => {
            return (
              <SpecificOrganization
                org={organization}
                updateOrgList={updateOrgList}
                key={i}
              />
            );
          })
        ) : (
          <h1 className="ion-padding">No organizations were found</h1>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyOrgs;
