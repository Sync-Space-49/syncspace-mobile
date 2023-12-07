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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
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
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    let token = await getAccessTokenSilently();
    getUserOrganizations();
    event.detail.complete();
  };
  const [userBoards, setUserBoards] = useState<any[]>([]);
  const [userAssignedCards, setUserAssignedCards] = useState<any[]>([]);
  const [favouritedBoard, setFavouritedBoard] = useState<any[]>([]);

  const personalOrgSetup = async () => {
    const isFirstLogin = user!.isFirstLogin;
    // if (isLoading) {
    present({
      duration: 3000,
    });
    // }
    console.log("isFirstLogin: " + isFirstLogin);
    if (isFirstLogin) {
      const userOrgs: Organization[] | null = await getUserOrganizations();
      if (userOrgs) {
        console.log("user orgs are: ", userOrgs);
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

  const getUserOrganizations = async () => {
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
        console.log("user organizations: ", userOrganizations);
        return userOrganizations;
      })
      .catch((error) => {
        console.log("failed to fetch user organizations: ", error.message);
      });
    return null;
  };

  const getUserBoards = async () => {
    let token = await getAccessTokenSilently();
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}api/users/${userId}/boards`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const userBoards = response.data;
        console.log("user boards: ", userBoards);
        setUserBoards(userBoards);
        return userBoards;
      })
      .catch((error) => {
        console.log("failed to fetch user boards: ", error.message);
      });
    return null;
  };

  const getUserAssignedCards = async () => {
    let token = await getAccessTokenSilently();
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}api/users/${userId}/assigned`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const userAssignedCards = response.data;
        console.log("user assigned cards: ", userAssignedCards);
        setUserAssignedCards(userAssignedCards);
        return userAssignedCards;
      })
      .catch((error) => {
        console.log("failed to fetch user assigned cards: ", error.message);
      });
    return null;
  };

  const getFavouriteBoards = async () => {
    let token = await getAccessTokenSilently();
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}api/users/${userId}/boards/favourite`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const favouritedBoards = response.data;
        console.log("user favourited boards: ", favouritedBoards);
        setFavouritedBoard(favouritedBoards);
        return favouritedBoards;
      })
      .catch((error) => {
        console.log(
          "failed to fetch user favourited boards cards: ",
          error.message
        );
      });
    return null;
  };

  useEffect(() => {
    if (user && !isLoading) {
      if (user!.isFirstLogin && !orgCreated) {
        personalOrgSetup();
      }
      getUserBoards();
      getUserAssignedCards();
      getFavouriteBoards();
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
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
          title="Recent Boards"
          items={userBoards.map((board) => ({
            text: board.title,
            listImg:
              "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
          }))}
        />
        <CustomList
          title="Favorited Boards"
          items={favouritedBoard.map((board) => ({
            text: board.title,
            listImg:
              "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
          }))}
        />
        <CustomList
          title="My Cards"
          items={userAssignedCards.map((card) => ({
            text: card.title,
            listImg:
              "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
          }))}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
