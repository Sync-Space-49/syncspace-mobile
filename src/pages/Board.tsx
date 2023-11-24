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
  IonBackButton,
  IonButtons,
  IonIcon,
  IonModal,
  IonButton,
  IonGrid,
  IonRow,
  IonToggle,
  IonInput,
  IonTextarea,
  IonCol,
  IonActionSheet,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  addOutline,
  ellipsisHorizontal,
  chevronDownOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import BoardStack from "../components/BoardStack";
import MemberList from "../components/MemberList";
import { serverAdress } from "../auth.config";
import "./Board.css";
import { useAuth0 } from "@auth0/auth0-react";

import { Stack, type Board, type Organization, type Panel, type User } from "../types"
import { RouteComponentProps, useHistory } from "react-router";
interface BoardDetailPageProps
  extends RouteComponentProps<{
    orgId: string;
    boardId: string;
  }> { }

interface PanelProps {
  title: string;
  id: string;
  position: Number;
  boardId: string;
  stacks: []
}

interface ButtonProps {
  text: string;
  data: {};
}

interface ActionSheetProps {
  text: string;
  data: {};
  role?: string
}

interface StackProps {
  id: string,
  title: string,
  position: Number,
  panelId?: string,
}

const Board: React.FC<BoardDetailPageProps> = ({ match }) => {
  const orgId: string = match.params.orgId;
  const boardId: string = match.params.boardId;

  const history = useHistory();
  const { getAccessTokenSilently, user } = useAuth0();

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);

  // const [canDismiss, setCanDismiss] = useState(false); // prevents user from discarding unsaved changes
  const [board, setBoard] = useState<Board>();
  const [panels, setPanels] = useState<Panel[]>();
  const [panelNames, setPanelNames] = useState<ButtonProps[]>([]);
  const [currentPanel, setCurrentPanel] = useState('');
  const [stacks, setStacks] = useState<Stack[]>([]);

  const [presentingElement, setPresentingElement] = useState<
    HTMLElement | undefined
  >(undefined);

  function dismiss() {
    modal.current?.dismiss();
  }

  const getDetailedBoard = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/details`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const data = response.data as Board;
        setBoard(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const updateBoard = async (title: string, ownerId: string, isPrivate: boolean) => {
    const token = await getAccessTokenSilently();
    const data = {} as any;
    if (title) { data.title = title }
    if (ownerId) { data.ownerId = ownerId }
    if (isPrivate) { data.isPrivate = isPrivate }

    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}`,
      headers: { authorization: `Bearer ${token}` },
      data: data
    };

    await axios(options)
      .then(() => {
        // Not sure if you want to do something on success
        return
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const deleteBoard = async (title: string, ownerId: string, isPrivate: boolean) => {
    const token = await getAccessTokenSilently();

    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then(() => {
        // Not sure if you want to do something on success
        return
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  // NOT IMPLEMENTED YET ON API
  const getBoardMembers = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/members`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const data = response.data as User[];
        return data;
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const addBoardMember = async (userId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "POST",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/members`,
      headers: { authorization: `Bearer ${token}` },
      data: {
        "user_id": userId
      }
    };

    await axios(options)
      .then(() => {
        // Not sure if you want to do something on success
        return
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getDetailedBoard();
    event.detail.complete();
  };

  useEffect(() => {
    getDetailedBoard();
  }, []);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    if (board && board.panels?.length > 0) {
      const panelNames = board.panels.map((panel: PanelProps) => ({
        title: panel.title,
        id: panel.id,
        position: panel.position,
        boardId: panel.boardId
      }));
      setPanels(panelNames);
      setCurrentPanel(panelNames[0].title || '');
    }
  }, [board]);

  useEffect(() => {
    if (panels && panels.length > 0) {
      const updatedPanelNames: ActionSheetProps[] = panels.map((panel) => ({
        text: panel.title,
        data: {
          action: panel.title
        }
      }));
      updatedPanelNames.push({ text: 'Cancel', role: 'cancel', data: { action: 'cancel' } });
      setPanelNames(updatedPanelNames);
    }
  }, [panels]);

  useEffect(() => {
    if (board && board.panels?.length > 0) {
      const allStacks = board.panels.flatMap((panel: PanelProps) =>
        panel.stacks.map((stack) => stack)
      )
      setStacks(allStacks);
    }
  }, [board]);

  return (
    <IonPage ref={page}>
      <IonHeader collapse="fade">
        <div className="toolbar-shrink">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/app"
                className="ion-margin-vertical"
              />
            </IonButtons>
            <IonTitle>{board?.title}</IonTitle>
            <IonButtons slot="end">
              <IonButton id="open-modal">
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>
            <IonModal
              ref={modal}
              trigger="open-modal"
              presentingElement={presentingElement!}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Board Settings</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => dismiss()}>Close</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              {/* modal content */}
              <IonContent className="ion-padding" scroll-y="false">
                <IonGrid>
                  <IonRow className="ion-justify-content-center">
                    <IonToggle>Enable AI</IonToggle>
                  </IonRow>
                  <IonRow>
                    <IonLabel className="ion-padding-vertical">
                      <strong>Actions</strong>
                    </IonLabel>
                    <form>
                      <IonList inset={true}>
                        <IonItem>
                          <IonInput label="Title:" placeholder="Backend" />
                        </IonItem>
                        <IonItem>
                          <IonTextarea
                            rows={3}
                            autoGrow={true}
                            label="Description:"
                            placeholder="A board dedicated to the backend team"
                          />
                        </IonItem>
                      </IonList>
                    </form>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel className="ion-padding-vertical">
                        <strong>Board Members</strong>
                      </IonLabel>
                    </IonCol>
                    <div className="add-member-button">
                      <IonButton size="small">
                        <IonIcon slot="icon-only" icon={addOutline} />
                      </IonButton>
                    </div>
                  </IonRow>
                  <IonList inset={true}>
                    <MemberList />
                    <MemberList />
                    <MemberList />
                  </IonList>
                  <IonRow className="edit-buttons">
                    <IonCol>
                      <IonButton color="danger">Delete</IonButton>
                    </IonCol>
                    <IonCol />
                    <IonCol>
                      <IonButton color="tertiary">Save</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
            </IonModal>
          </IonToolbar>
        </div>
        <div className="subtitle">
          <IonToolbar>
            <IonButton
              size="small"
              fill="clear"
              color="medium"
              id="open-action-sheet"
            >
              <IonIcon slot="end" icon={chevronDownOutline} />
              <strong>{currentPanel}</strong>
            </IonButton>
            <IonActionSheet
              trigger="open-action-sheet"
              header="Choose Board View"
              buttons={panelNames}
              onDidDismiss={({ detail }) => setCurrentPanel(detail.data.action)}
            />
          </IonToolbar>
        </div>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* end of modal and headers, beginning of Board page content */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          style={{
            //@ts-ignore
            "--swiper-pagination-color": "#80e08b",
            "--swiper-pagination-bullet-inactive-color": "#92949c",
          }}
        >
          <IonContent className="ion-padding-end">
            {stacks && stacks.length > 0 ? (
              stacks.map((stack) => {
                return <SwiperSlide key={stack.id}>
                  <BoardStack stack={stack} key={stack.id} />
                </SwiperSlide>
              })
            ) : (
              <h1 className="ion-padding">No stacks were found</h1>
            )}
          </IonContent>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Board;
