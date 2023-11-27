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
import NewStack from "../components/NewStack";
import BoardSettings from "../components/BoardSettings";
interface BoardDetailPageProps
  extends RouteComponentProps<{
    orgId: string;
    boardId: string;
  }> { }

interface ButtonProps {
  text: string;
  data: {};
}

interface ActionSheetProps {
  text: string;
  data: {};
  role?: string
  handler?: () => boolean | void | Promise<boolean | void>;
}

const Board: React.FC<BoardDetailPageProps> = ({ match }) => {
  const orgId: string = match.params.orgId;
  const boardId: string = match.params.boardId;

  const history = useHistory();
  const { getAccessTokenSilently, user } = useAuth0();

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);

  // const [canDismiss, setCanDismiss] = useState(false); // prevents user from discarding unsaved changes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [board, setBoard] = useState<Board>();
  const [ownerId, setOwnerId] = useState<string>();
  const [panels, setPanels] = useState<Panel[]>();
  const [panelNames, setPanelNames] = useState<ButtonProps[]>([]);
  const [currentPanel, setCurrentPanel] = useState<number>();
  const [panelId, setPanelId] = useState<string>('');
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
        setOwnerId(data.owner_id);
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
    if (board) {
      setOwnerId(board.owner_id);
    }
    event.detail.complete();
  };

  const handleMenuClick = () => {
    console.log('settings clicked')
    setIsModalOpen(true);
    console.log(isModalOpen)
  };

  useEffect(() => {
    getDetailedBoard();
  }, []);

  useEffect(() => {
    const listenerHandler = () => {
      getDetailedBoard();
    }
    window.addEventListener('updateStack', listenerHandler);
    return () => {
      window.removeEventListener('updateStack', listenerHandler);
    }
  }, []);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    if (board && board.panels?.length > 0) {
      const updatedPanels = board.panels.map((panel: Panel) => ({
        title: panel.title,
        id: panel.id,
        position: panel.position,
        boardId: panel.boardId,
        stacks: panel.stacks
      }));
      setPanels(updatedPanels);

      if (typeof currentPanel !== 'number') {
        setCurrentPanel(0);
      }
      else {
        setPanelId(panels![currentPanel].id);
      }
    }
  }, [board]);

  useEffect(() => {
    if (panels && panels.length > 0) {
      const updatedPanelNames: ActionSheetProps[] = panels.map((panel) => ({
        text: panel.title,
        data: {
          action: panel.position
        }
      }));
      updatedPanelNames.push({ text: 'Cancel', role: 'cancel', data: { action: 'cancel' }, handler: () => { console.log("dismissed") } });
      setPanelNames(updatedPanelNames);
    }
  }, [panels, board]);

  useEffect(() => {
    if (panels && typeof currentPanel === 'number') {
      const allStacks = panels[currentPanel].stacks;
      setStacks(allStacks);
      setPanelId(panels[currentPanel].id)
    }
  }, [currentPanel, board]);

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
              <IonButton onClick={() => handleMenuClick()} slot="icon-only">
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>
            <BoardSettings board={board!} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onOpenChange={(isOpen) => setIsModalOpen(isOpen)}/>
          </IonToolbar>
        </div>
        {/* <div className="subtitle"> */}
        <IonToolbar>
          <div className="toolbar-action-sheet-button">
            <IonButton
              size="small"
              fill="clear"
              color="medium"
              id="open-action-sheet"
              className="ion-justify-content-center"
            >
              <IonIcon slot="end" icon={chevronDownOutline} />
              <strong>{panels && typeof currentPanel === 'number' ? panels[currentPanel].title : ''}</strong>
            </IonButton>
            <IonActionSheet
              trigger="open-action-sheet"
              header="Choose Board View"
              buttons={panelNames}
              onDidDismiss={({ detail }) => {
                if (detail.role === "backdrop" || detail.role === "cancel") {
                  console.log('cancelled')
                }
                else {
                  setCurrentPanel(detail.data.action);
                }
              }}
            />
          </div>
        </IonToolbar>
        {/* </div> */}
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
              stacks.map((stack, index: number) => (
                <>
                  <SwiperSlide key={stack.id}>
                    <BoardStack stack={stack} key={stack.id} orgId={orgId} boardId={boardId} ownerId={ownerId!}/>
                  </SwiperSlide>
                  {index === stacks.length - 1 && (
                    <SwiperSlide key={index}>
                      <NewStack
                        panelId={panelId}
                        orgId={orgId}
                        boardId={boardId}
                        hasStacks={true}
                        getBoard={getDetailedBoard}
                      />
                    </SwiperSlide>
                  )}
                </>
              ))
            ) : (
              <SwiperSlide>
                <NewStack
                  panelId={panelId}
                  orgId={orgId}
                  boardId={boardId}
                  hasStacks={false}
                  getBoard={getDetailedBoard}
                />
              </SwiperSlide>
            )}
          </IonContent>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Board;