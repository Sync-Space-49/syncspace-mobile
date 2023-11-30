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
  IonCol,
  IonActionSheet,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonPopover,
  IonAlert,
  IonListHeader,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from "@ionic/react";
import {
  addOutline,
  ellipsisHorizontal,
  chevronDownOutline,
  createOutline,
  albumsOutline,
  closeOutline,
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
import { OverlayEventDetail } from "@ionic/core";
import NewPanel from "../components/NewPanel";
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

interface UpdatePanelProps {
  title?: string;
  position?: number; 
}

const Board: React.FC<BoardDetailPageProps> = ({ match }) => {
  const orgId: string = match.params.orgId;
  const boardId: string = match.params.boardId;

  const history = useHistory();
  const { getAccessTokenSilently, user } = useAuth0();

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);

  const [canDismiss, setCanDismiss] = useState(true); // prevents user from discarding unsaved changes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [board, setBoard] = useState<Board>();
  const [ownerId, setOwnerId] = useState<string>();
  const [panels, setPanels] = useState<Panel[]>();
  const [panelNames, setPanelNames] = useState<ButtonProps[]>([]);
  const [currentPanel, setCurrentPanel] = useState<number>();
  const [panelId, setPanelId] = useState<string>('');
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [panelViewIsOpen, setPanelViewIsOpen] = useState(false);
  const [deletePanelAlert, setDeletePanelAlert] = useState(false);
  const [panelIdToDelete, setPanelIdToDelete] = useState<string | null>(null);
  const [editAlert, setEditAlert] = useState(false);
  const [panelModal, setPanelModal] = useState(false);
  const [boardModal, setBoardModal] = useState(false);

  const [presentingElement, setPresentingElement] = useState<
    HTMLElement | undefined
  >(undefined);

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

  const updatePanel = async (panelId: string, data: UpdatePanelProps) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (data.title) { body.append('title', data.title) }
    if (data.position) { body.append('position', data.position.toString()) }

    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}`,
      headers: { authorization: `Bearer ${token}` },
      data: body
    };

    await axios(options)
      .then(() => {
        setCanDismiss(true);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const deletePanel = async (panelId: string) => {
    const token = await getAccessTokenSilently();

    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}`,
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
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  function dismiss() {
    modal.current?.dismiss();
    setBoardModal(false);
    setPanelModal(false);
  }
  const onWillDisimss = (event: CustomEvent<OverlayEventDetail>) => {
    dismiss();
  }

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getDetailedBoard();
    if (board) {
      setOwnerId(board.owner_id);
    }
    event.detail.complete();
  };

  const handleUpdatePanel = (event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    panels?.forEach((panel) => {
      let possible_new_name = (event.target as any)[`panel_name_id_${panel.id}`].value;
      if (possible_new_name !== panel.title) {
        updatePanel(panel.id, {'title': possible_new_name})
      }
    })
  } 

  const handleDeletePanel = (panelId: string) => {
    setDeletePanelAlert(true)
    setPanelIdToDelete(panelId);
  }

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
          action: panel.position,
          id: panel.id
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
              <IonButton onClick={() => setBoardModal(true)} slot="icon-only">
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>
            {/* board modal  */}
            <IonModal
              ref={modal}
              isOpen={boardModal}
              onWillDismiss={(event) => onWillDisimss(event)}
              presentingElement={presentingElement!}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Board Settings</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setBoardModal(false)}>Close</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
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
                          <IonInput label="Title:" placeholder={board?.title} />
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
                      <IonButton size="small" slot="icon-only">
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
        <IonToolbar>
          <div className="toolbar-action-sheet-button">
            <IonButton
              size="small"
              fill="clear"
              color="medium"
              id="open-popover"
              className="ion-justify-content-center"
            >
              <IonIcon slot="end" icon={chevronDownOutline} />
              <strong>{panels && typeof currentPanel === 'number' ? panels[currentPanel].title : ''}</strong>
            </IonButton>
            <IonPopover trigger="open-popover" triggerAction="click" dismissOnSelect={true}>
              <IonList>
                <IonItem button={true} detail={false} onClick={() => setPanelModal(true)}>
                  <IonIcon slot="end" icon={createOutline}></IonIcon>
                  Edit panels
                </IonItem>
                <IonItem button={true} detail={false} onClick={() => setPanelViewIsOpen(true)}>
                  <IonIcon slot="end" icon={albumsOutline}></IonIcon>
                  Switch panels
                </IonItem>
              </IonList>
            </IonPopover>
            <IonAlert
              isOpen={editAlert}
              header="Edit"
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Alert cancelled')
                  }
                },
                {
                  text: 'Confirm change',
                  role: 'confirm',
                }
              ]}
              inputs={[
                {
                  placeholder: 'Title',
                  attributes: {
                    maxLength: 255
                  }
                }
              ]}
              onDidDismiss={({ detail }) => {
                if (detail.role === 'confirm') {
                  let title = detail.data.values[0]

                }
                setEditAlert(false);
              }}
            />
            <IonActionSheet
              isOpen={panelViewIsOpen}
              header="Choose Board View"
              buttons={panelNames}
              onDidDismiss={({ detail }) => {
                if (detail.role === "backdrop" || detail.role === "cancel") {
                  console.log('cancelled')
                }
                else {
                  setCurrentPanel(detail.data.action);
                }
                setPanelViewIsOpen(false);
              }}
            />
            {/* Panel modal  */}
            <IonModal
              ref={modal}
              isOpen={panelModal}
              initialBreakpoint={.75}
              breakpoints={[0, .75]}
              onDidDismiss={() => setPanelModal(false)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Edit Panels</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setPanelModal(false)}>Close</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              {/* modal content */}
              <IonContent className="ion-padding" >
                <IonGrid>
                  <form onSubmit={(event) => handleUpdatePanel(event)}>
                    <IonRow className="ion-justify-content-center">
                      <IonListHeader>{board?.title}'s panels</IonListHeader>
                      <IonList inset={true} >
                        {panels && panels.length > 0 ? (
                          panels.map((panel, index) => (
                            <IonItemSliding key={index}>
                              <IonItem key={panel.id}>
                                <IonInput label="Panel title:" placeholder='Sprint 1' value={panel.title} name={`panel_name_id_${panel.id}`} onIonChange={(e) => setCanDismiss(false)} />
                              </IonItem>
                              <IonItemOptions slot="end">
                                <IonItemOption color="danger" id="delete-panel-alert" onClick={() => handleDeletePanel(panel.id)}>
                                  <IonIcon slot="icon-only" icon={closeOutline} />
                                </IonItemOption>
                              </IonItemOptions>
                            </IonItemSliding>
                          ))
                        )
                          : (
                            <IonItem>
                              <IonLabel>
                                No panels found
                              </IonLabel>
                            </IonItem>
                          )}
                      </IonList>
                      <IonAlert
                        isOpen={deletePanelAlert}
                        trigger="delete-panel-alert"
                        header="Are you sure you want to delete this panel?"
                        buttons={[
                          {
                            text: "Cancel",
                            role: "cancel",
                          },
                          {
                            text: "Delete",
                            role: 'confirm',
                          },
                        ]}
                        onIonAlertDidDismiss={({ detail }) => {
                          if (detail.role === 'confirm') {
                            deletePanel(panelIdToDelete!);
                          }
                          setDeletePanelAlert(false);
                        }}
                      />
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                      <NewPanel orgId={orgId} boardId={boardId} />
                    </IonRow>
                    <IonRow className="ion-justify-content-end ion-padding-end">
                      <IonButton color="tertiary" type="submit">Save</IonButton>
                    </IonRow>
                  </form>
                </IonGrid>
              </IonContent>
            </IonModal>
          </div>
        </IonToolbar>
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
                    <BoardStack stack={stack} key={stack.id} orgId={orgId} boardId={boardId} ownerId={ownerId!} />
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