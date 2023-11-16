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
import { useEffect, useState } from "react";
import { addOutline } from "ionicons/icons";
import { RouteComponentProps, useHistory } from "react-router";
import "./Organization.css";
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
}

const OrgDetail: React.FC<OrgDetailPageProps> = ({ match }) => {
  const { getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  const orgId:string = match.params.orgId;
  
  const [organization, setOrganization] = useState<Organization>();
  const [boards, setBoards] = useState<Board[]>();
  const [viewableBoardsProps, setViewableBoardsProps] = useState<ListProps[]>([]);
  const [hiddenBoardsProps, setHiddenBoardsProps] = useState<ListProps[]>();
  
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
      .then((response) =>  {
        const org = response.data;
        setOrganization(org);
        // dismiss();
      })
      .catch((error) => {
        console.log(error.message);
        // dismiss();
      });
  }

  const getBoards = async () => {
    let token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}/boards`,
      headers: { authorization: `Bearer ${token}` },
    };
    // setIsLoading(true);
    let data: any;
    await axios(options)
      .then((response) => {
        data = response.data;
        setBoards(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.persist();
    setPopoverState({ showPopover: true, event: e.nativeEvent });
  };

  const handleCreateOrganization = () => {
    console.log("board created");
    history.push("/app/board");
    setPopoverState({ showPopover: false, event: undefined });
    //redirect "create with AI to AI tour"
  };

  useEffect(() => {
    getOrganization();
    getBoards();
  }, []);

  useEffect(() => {
    if(boards) {
      let hiddenBoards = [];
      let nonHiddenBoards = [];
      
      for (let i = 0; i < boards.length; i++) {
        if (boards[i].is_private) {
          hiddenBoards.push(boards[i])
        } else {
          nonHiddenBoards.push(boards[i])
        }
      }

      if(nonHiddenBoards && nonHiddenBoards.length > 0) {
        const viewableListProp = nonHiddenBoards.map((board) => ({
          text: board.title
        }));
        setViewableBoardsProps(viewableListProp);
        console.log('VLP '+viewableListProp[0].text)
      }
      if(hiddenBoards && hiddenBoards.length > 0) {
        const privateListProp = hiddenBoards.map((board) => ({
          text: board.title
        }));
        setHiddenBoardsProps(privateListProp);
        console.log('PLP '+ privateListProp)
      }
    }
  }, [boards]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{organization?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{organization?.name}</IonTitle>
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
          title={customListTitle}
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={viewableBoardsProps}
        />
        <CustomList
          title="Hidden Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={hiddenBoardsProps}
        />
      </IonContent>
    </IonPage>
  );
};

export default OrgDetail;
