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
  useIonLoading,
} from "@ionic/react";
import CustomList from "../components/CustomList";
import "./Home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { serverAdress } from "../auth.config";
import axios from "axios";
import { Organization } from "../types";

const Home: React.FC = () => {
  const { isLoading, user, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [present] = useIonLoading();

  const [orgCreated, setOrgCreated] = useState(false);

  const personalOrgSetup = async () => {
    const isFirstLogin = user!.isFirstLogin;
    // if (isLoading) {
      present({
        duration: 3000,
      });
    // }
    console.log("isFirstLogin: " + isFirstLogin);
    if (isFirstLogin) {
      const userOrgs: Organization[] | null = await getOrganizations();
      if (userOrgs) {
        console.log(userOrgs);
        return console.log("user orgs exist, exited personal org creation");
      }
      const token = await getAccessTokenSilently();
      const body = new FormData();
      if (user?.name) {
        body.append("title", `${user.name}'s `);
      } else {
        body.append("title", `${user?.nickname}'s board`);
      }
      body.append("description", "Personal organization");
      const options = {
        method: "POST",
        url: `${serverAdress}api/organizations`,
        headers: { authorization: `Bearer ${token}` },
        data: body,
      };
      await axios(options)
        .then((response) => {
          console.log("personal org created!");
          setOrgCreated(true);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  };

  const getOrganizations = async () => {
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
        return userOrganizations;
      })
      .catch((error) => {
        console.log(error.message);
      });
    return null;
  };

  useEffect(() => {
    if (user && !isLoading) {
      if (user!.isFirstLogin && !orgCreated) {
        personalOrgSetup();
      }
    }
  }, [user]);

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
          {isAuthenticated ? (
            <IonToast
              message="You were successfully signed in!"
              duration={3000}
            />
          ) : (
            <IonToast message="You are not signed in." />
          )}
        </div>
        <CustomList
          title="Quick Access"
          items={[
            {
              text: "Mobile",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Axe-Hacks",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Fall'23",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
          ]}
        />

        <CustomList
          title="Recent Activity"
          subTitle="Today"
          items={[
            {
              text: "Dylan created a new ticket: “Modify AI Models”",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Sumi marked “Create flyers for Axe-Hacks” as completed",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Tyler deleted “[SPIKE] Research AI”",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
          ]}
        />

        <CustomList
          subTitle="Yesterday"
          items={[
            {
              text: "Nathan edited “Add Account Functionality”",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "Kaitlyn commented “Should we use React?”",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
            {
              text: "MJ marked “Update Github README” as in-progress",
              listImg:
                "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
