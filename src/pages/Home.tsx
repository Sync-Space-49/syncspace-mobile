import {
  IonContent,
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
import HomeCustomList from "../components/HomeCustomList";
import "./Home.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { serverAdress } from "../auth.config";
import axios from "axios";
import { Organization } from "../types";

interface BoardItem {
  text: string;
  boardId: string;
  orgId: string;
}

const Home: React.FC = () => {
  const { isLoading, user, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [present] = useIonLoading();
  const [orgCreated, setOrgCreated] = useState(false);
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await getAccessTokenSilently().then((token) => {
      getUserOrganizations();
      getUserBoards(token);
      getUserAssignedCards(token);
      getFavouriteBoards(token);
    });
    event.detail.complete();
  };
  const [userBoards, setUserBoards] = useState<any[]>([]);
  const [userAssignedCards, setUserAssignedCards] = useState<any[]>([]);
  const [favouritedBoard, setFavouritedBoard] = useState<any[]>([]);
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [favoritedBoardItems, setFavoritedBoardItems] = useState<BoardItem[]>(
    []
  );
  const [cardItems, setCardItems] = useState<BoardItem[]>([]);

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
        url: `${serverAdress}/api/organizations`,
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
      url: `${serverAdress}/api/users/${userId}/organizations`,
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

  const getUserBoards = async (token: string) => {
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}/api/users/${userId}/boards`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const userBoards = response.data;
        console.log("user boards: ", userBoards);
        console.log("user boards, board id", response.data[0].id);
        console.log("user boards, org id", response.data[0].organization_id);
        setUserBoards(userBoards);
        return userBoards;
      })
      .catch((error) => {
        console.log("failed to fetch user boards: ", error.message);
      });
    return null;
  };

  const getUserAssignedCards = async (token: string) => {
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}/api/users/${userId}/assigned`,
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

  const getFavouriteBoards = async (token: string) => {
    const userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}/api/users/${userId}/boards/favourite`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const favouritedBoards = response.data;
        console.log("user favourited boards: ", favouritedBoards);
        console.log("user favourited boards, board id", response.data[0].id);
        console.log(
          "user favourited boards, org id",
          response.data[0].organization_id
        );
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
    }
  }, [user]);

  useEffect(() => {
    if (userBoards) {
      const sortedBoards = userBoards.sort((a, b) => {
        return (
          new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
        );
      });

      console.log("Sorted Boards: ", sortedBoards);
      const recentBoards = sortedBoards.slice(0, 3);

      const newBoardItems = recentBoards.map((board) => ({
        text: board.title,
        boardId: board.id,
        orgId: board.organization_id,
        listImg:
          "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
      }));

      console.log("New Board Items: ", newBoardItems);

      setBoardItems(newBoardItems);
    }
  }, [userBoards]);

  useEffect(() => {
    if (userAssignedCards) {
      const newUserAssignedCards = userAssignedCards.map((card) => ({
        text: card.title,
        boardId: card.board_id,
        orgId: card.org_id,
        listImg:
          "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
      }));
      setCardItems(newUserAssignedCards);
    }
  }, [userAssignedCards]);

  useEffect(() => {
    if (favouritedBoard) {
      const newFavouritedBoard = favouritedBoard.map((board) => ({
        text: board.title,
        boardId: board.id,
        orgId: board.organization_id,
        listImg:
          "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
      }));
      setFavoritedBoardItems(newFavouritedBoard);
    }
  }, [favouritedBoard]);

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
        <HomeCustomList title="Recent Boards" items={boardItems} />
        <HomeCustomList title="Favourited Boards" items={favoritedBoardItems} />
        <HomeCustomList title="My Cards" items={cardItems} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
