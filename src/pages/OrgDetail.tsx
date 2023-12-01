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
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonBackButton,
  IonSpinner,
  IonAlert,
} from "@ionic/react";
import CustomList from "../components/CustomList";
import { useEffect, useState } from "react";
import { addOutline, colorWandOutline } from "ionicons/icons";
import { RouteComponentProps, useHistory } from "react-router";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { serverAdress } from "../auth.config";
import { Board, Organization } from "../types";

interface OrgDetailPageProps
  extends RouteComponentProps<{
    orgId: string;
  }> {}

interface ListProps {
  text: string; // the list's content
  listImg?: string; //list image src
  boardId: string;
}

const OrgDetail: React.FC<OrgDetailPageProps> = ({ match }) => {
  const { getAccessTokenSilently } = useAuth0();
  const history = useHistory();
  const orgId: string = match.params.orgId;

  const [organization, setOrganization] = useState<Organization>();
  const [boards, setBoards] = useState<Board[]>();
  const [viewableBoardsProps, setViewableBoardsProps] = useState<ListProps[]>(
    []
  );
  const [hiddenBoardsProps, setHiddenBoardsProps] = useState<ListProps[]>();
  const [showAlert, setShowAlert] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const customListTitle = `${organization?.name}'s boards`;

  const [popoverState, setPopoverState] = useState<{
    showPopover: boolean;
    event: Event | undefined;
  }>({ showPopover: false, event: undefined });

  const getOrganization = async () => {
    let token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
    };
    await axios(options)
      .then((response) => {
        const org = response.data;
        setOrganization(org);
        // setLoading(false);
      })
      .catch((error) => {
        console.log("failed to fetch organizations: ", error.message);
      });
  };

  const getBoards = async () => {
    let token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}/boards`,
      headers: { authorization: `Bearer ${token}` },
    };
    let data: any;
    await axios(options)
      .then((response) => {
        data = response.data;
        setBoards(data);
        // setLoading(false);
      })
      .catch((error) => {
        console.error("failed to fetchboards: ", error.message);
        // setLoading(false);
      });
  };

  const createBoard = async (title: string, isPrivate: boolean) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (title) {
      body.append("title", title);
    }
    body.append("isPrivate", isPrivate ? "1" : "0");
    console.log("Sending data:", body);

    const options = {
      method: "POST",
      url: `${serverAdress}api/organizations/${orgId}/boards`,
      headers: { authorization: `Bearer ${token}` },
      data: body,
    };

    await axios(options)
      .then(async (response) => {
        console.log("success, board created, response: ", response);
        const boardId = response.data.id;
        console.log("boardId: ", boardId);

        await getAccessTokenSilently().then(() => {
          getBoards();
        });

        setIsPopoverOpen(false);
      })
      .catch((error) => {
        console.error(
          "ERROR: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const handleNewAI = () => {
    console.log("New board with AI clicked!");
  };
  const handleNewBoard = () => {
    console.log("New board clicked!");
  };
  const handleCreateBoard = () => {
    setShowAlert(true);
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getBoards();
    event.detail.complete();
  };

  useEffect(() => {
    // setLoading(true);
    setOrganization(undefined);
    setBoards(undefined);
    getOrganization();
    getBoards();
  }, [orgId]);

  useEffect(() => {
    if (boards) {
      let hiddenBoards = [];
      let nonHiddenBoards = [];

      for (let i = 0; i < boards.length; i++) {
        if (boards[i].is_private) {
          hiddenBoards.push(boards[i]);
        } else {
          nonHiddenBoards.push(boards[i]);
        }
      }

      if (nonHiddenBoards && nonHiddenBoards.length > 0) {
        const viewableListProp = nonHiddenBoards.map((board) => ({
          text: board.title,
          boardId: board.id,
        }));
        setViewableBoardsProps(viewableListProp);
      }
      if (hiddenBoards && hiddenBoards.length > 0) {
        const privateListProp = hiddenBoards.map((board) => ({
          text: board.title,
          boardId: board.id,
        }));
        setHiddenBoardsProps(privateListProp);
      }
    }
  }, [boards]);

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <div className="toolbar-shrink">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/app"
                className="ion-margin-vertical"
              />
            </IonButtons>
            <IonTitle>{organization?.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                id="new-board-btn"
                onClick={() => setIsPopoverOpen(true)}
              >
                <IonIcon slot="icon-only" icon={addOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonPopover
            isOpen={isPopoverOpen}
            onDidDismiss={() => setIsPopoverOpen(false)}
            trigger="new-board-btn"
            triggerAction="click"
          >
            <IonList>
              <IonItem button={true} detail={false} onClick={handleCreateBoard}>
                New board
              </IonItem>
              <IonItem button={true} detail={false} onClick={handleNewAI}>
                <IonIcon slot="end" icon={colorWandOutline}></IonIcon>
                New board with AI
              </IonItem>
              <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Enter Board Name"
                buttons={[
                  {
                    text: "Finish",
                    handler: (alertData) => {
                      const title = alertData.title;
                      const isPrivate = alertData.isPrivate === "true";
                      createBoard(title, isPrivate);
                    },
                  },
                ]}
                inputs={[
                  {
                    name: "title",
                    placeholder: "Title",
                  },
                  {
                    name: "isPrivate",
                    placeholder: "isPrivate",
                  },
                  // {
                  //   label: "IsPrivate",
                  //   type: "radio",
                  //   value: "isPrivate",
                  // },
                  // {
                  //   name: "isPrivate",
                  //   type: "checkbox",
                  //   label: "Private Board",
                  //   value: "true", // default val when checked
                  //   checked: false,
                  // },
                ]}
              />
            </IonList>
          </IonPopover>
        </div>
      </IonHeader>
      <IonContent fullscreen>
        {/* {loading ? (
          <IonSpinner color="primary" className="ion-padding" />
        ) : (
          <> */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomList
          orgId={orgId}
          title={customListTitle}
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={viewableBoardsProps}
        />
        <CustomList
          orgId={orgId}
          title="Hidden Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={hiddenBoardsProps}
        />
        {/* </>
        )} */}
      </IonContent>
    </IonPage>
  );
};

export default OrgDetail;
