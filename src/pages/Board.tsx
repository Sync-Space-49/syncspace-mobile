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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonReorder,
  IonReorderGroup,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  ItemReorderEventDetail,
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

import { Stack, type Board, type Organization, type Panel, type User, Card } from "../types"
import { RouteComponentProps, useHistory } from "react-router";
import NewStack from "../components/NewStack";
import { OverlayEventDetail } from "@ionic/core";
import NewPanel from "../components/NewPanel";
import NewCard from "../components/NewCard";
import StackSettings from "../components/StackSettings";
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

interface Item {
  id: string;
  title: string;
}

interface UpdateCardProps {
  title?: string;
  description?: string;
  position?: number;
}

const Board: React.FC<BoardDetailPageProps> = ({ match }) => {
  const orgId: string = match.params.orgId;
  const boardId: string = match.params.boardId;

  const history = useHistory();
  const { getAccessTokenSilently, user } = useAuth0();

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);
  const userId = user!.sub;

  const [canDismiss, setCanDismiss] = useState(true); // prevents user from discarding unsaved changes
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

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [cardModal, setCardModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [deleteCardAlert, setDeleteCardAlert] = useState(false);
  const [cardIdToDelete ,setCardIdToDelete] = useState<string>();
  const [prevPanels, setPrevPanels] = useState<Panel[]>();
  const [updaetedPanels, setUpdatedPanels] = useState<Panel[]>();


  const members = ["Member 1", "Member 2", "Member 3"];

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
      .then(async (response) => {
        const data = response.data as Board;
        await setBoard(data);
        console.log('getdetailedboard set board');
        setOwnerId(board!.owner_id);
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
        getDetailedBoard();
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
        getDetailedBoard();
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

  const updateCard = async (data: UpdateCardProps, card: Card) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (data.title) { body.append('title', data.title) }
    if (data.position) { body.append('position', data.position.toString()) }
    if (data.description) { body.append('description', data.description) }

    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${card.stack_id}/cards/${card.id}`,
      headers: { authorization: `Bearer ${token}` },
      data: body
    };

    await axios(options)
      .then(async () => {
        await getAccessTokenSilently({ cacheMode: 'off' }).then(() => {
          getDetailedBoard();
        })
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const deleteCard = async (card: Card) => {
    const token = await getAccessTokenSilently();

    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${card.stack_id}/cards/${card.id}`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then(async () => {
        await getAccessTokenSilently({ cacheMode: 'off' }).then(() => {
          getDetailedBoard();
          setCardModal(false);
        })
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const createStack = async (title: string) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    body.append("title", title);

    const options = {
        method: "POST",
        url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks`,
        headers: { authorization: `Bearer ${token}` },
        data: body
    };

    await axios(options)
        .then(async () => {
          await getAccessTokenSilently().then(() => {
            getDetailedBoard();
          })
        })
        .catch((error) => {
            console.error(error.message);
        });
}

  function dismiss() {
    modal.current?.dismiss();
    setBoardModal(false);
    setPanelModal(false);
    setCardModal(false);
  }
  const onWillDisimss = (event: CustomEvent<OverlayEventDetail>) => {
    dismiss();
  }

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getDetailedBoard();
    if (board) {
      setOwnerId(board!.owner_id);
    }
    event.detail.complete();
  };

  const handleUpdatePanel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    panels?.forEach((panel) => {
      let possible_new_name = (event.target as any)[`panel_name_id_${panel.id}`].value;
      if (possible_new_name !== panel.title) {
        updatePanel(panel.id, { 'title': possible_new_name })
      }
    })
  }

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log("dragged from index", event.detail.from, "to", event.detail.to);
    event.detail.complete();
  }

  const handleDeletePanel = (panelId: string) => {
    setDeletePanelAlert(true)
    setPanelIdToDelete(panelId);
  }

  const handleItemClick = (card: Card) => {
    console.log('clicked');
    setCurrentCard(card)
    setSelectedItem(card);
    setCardModal(true)
  };

  const handleUpdateCard = (event: React.FormEvent<HTMLFormElement>, card: Card) => {
    event.preventDefault();
    let possible_new_title;
    let possible_new_description;
    let body: UpdateCardProps = { 'title': undefined, 'description': undefined }

    if ((event.target as any)[`card_title_id_${card.id}`].value !== card.title) {
      possible_new_title = (event.target as any)[`card_title_id_${card.id}`].value;
      body.title = possible_new_title
    }
    if ((event.target as any)[`card_description_id_${card.id}`].value !== card.description) {
      possible_new_description = (event.target as any)[`card_description_id_${card.id}`].value;
      body.description = possible_new_description
    }
    console.log(body);

    if (body.description !== '' || body.title !== '') {
      updateCard(body, card)
    }
  }

  const handleDeleteCard = (cardId: string) => {
    setDeleteCardAlert(true);
    setCardIdToDelete(cardId);
  }

  useEffect(() => {
    getDetailedBoard();
    console.log('useeffect set board');
  }, []);

  // useEffect(() => {
  //   const listenerHandler = () => {
  //     getDetailedBoard();
  //   }
  //   window.addEventListener('updateStack', listenerHandler);
  //   return () => {
  //     window.removeEventListener('updateStack', listenerHandler);
  //   }
  // }, []);

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
      console.log('useeffect set panels');
      if (typeof currentPanel !== 'number') {
        setCurrentPanel(0);
      }
      else {
        setPanelId(panels![currentPanel].id);
      }
    }
  }, [board, stacks]);

  useEffect(() => {
    if (panels && panels.length > 0) {
      setPrevPanels(panels);
      const updatedPanelNames: ActionSheetProps[] = panels.map((panel) => ({
        text: panel.title,
        data: {
          action: panel.position,
          id: panel.id
        }
      }));
      updatedPanelNames.push({ text: 'Cancel', role: 'cancel', data: { action: 'cancel' }, handler: () => { console.log("dismissed") } });
      setPanelNames(updatedPanelNames);
      console.log('useeffect set panelNames');
    }
  }, [panels, board]);

  useEffect(() => {
    if (panels && typeof currentPanel === 'number') {
      const allStacks = panels[currentPanel].stacks;
      setStacks(allStacks);
      setPanelId(panels[currentPanel].id)
      console.log('useeffect set stacks');
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
                    {/* <BoardStack stack={stack} key={stack.id} orgId={orgId} boardId={boardId} ownerId={ownerId!} setBoard={setBoard}/> */}
                    <IonCard>
                      <IonCardHeader>
                        <IonCardTitle>{stack.title}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonList inset={true}>
                          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {stacks[index].cards && stacks[index].cards.length > 0 ? (
                              stacks[index].cards.map((card: Card, i) => (
                                // <IonItem key={card.id} onClick={() => handleItemClick(card)} lines="inset" >
                                <IonItem key={card.id} onClick={() => handleItemClick(card)} lines="inset">
                                  <IonLabel>{card.title}</IonLabel>
                                  <IonReorder slot="end"></IonReorder>
                                </IonItem>

                              ))
                            ) : (
                              // <IonItem lines="inset">
                              <IonItem >
                                <IonLabel>This stack has no cards</IonLabel>
                              </IonItem>
                            )}
                          </IonReorderGroup>
                        </IonList>
                        {/* <IonButton fill="clear" className="ion-align-items-center">
          <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
        </IonButton> */}
                      </IonCardContent>
                      {
                        userId === ownerId ? (
                          <StackSettings
                            stack={stack}
                            orgId={orgId}
                            boardId={boardId}
                          />
                        )
                          :
                          <></>
                      }
                      <NewCard
                        stack={stack}
                        orgId={orgId}
                        boardId={boardId}
                      />

                      {/* Modal */}

                      {
                        selectedItem && (
                          // <CardSettings
                          //   key={currentCard?.id}
                          //   card={currentCard!}
                          //   isOpen={isModalOpen}
                          //   onClose={() => setIsModalOpen(false)}
                          //   stack={stack}
                          //   boardId={boardId}
                          //   orgId={orgId}
                          //   setBoard={setBoard}
                          // />
                          <IonModal
                            ref={modal}
                            isOpen={cardModal}
                            // trigger="open-card-modal"
                            onWillDismiss={(event) => onWillDisimss(event)}

                            // onDidDismiss={() => setCardModal(false)}
                            presentingElement={presentingElement}
                          >
                            <IonHeader>
                              <IonToolbar>
                                <IonTitle>Card Settings</IonTitle>
                                <IonButtons slot="end">
                                  <IonButton onClick={() => setCardModal(false)}>Close</IonButton>
                                </IonButtons>
                              </IonToolbar>
                            </IonHeader>
                            <IonContent className="ion-padding">
                              <IonGrid>
                                <IonRow>
                                  <IonLabel className="ion-padding-vertical">
                                    <strong>Details</strong>
                                  </IonLabel>
                                  { currentCard ?
                                    <form onSubmit={(event) => handleUpdateCard(event, currentCard!)}>
                                      <IonList inset={true}>
                                        <IonItem>
                                          <IonInput label="Card Title:" value={currentCard?.title} name={`card_title_id_${currentCard?.title}`} />
                                        </IonItem>
                                        <IonItem>
                                          <IonTextarea
                                            rows={3}
                                            autoGrow={true}
                                            label="Description:"
                                            value={currentCard?.description}
                                            name={`card_description_id_${currentCard?.description}`}
                                          />
                                        </IonItem>
                                      </IonList>
                                      <IonButton className="ion-justify-content-center" color="tertiary" size="small" type="submit">Save</IonButton>
                                    </form>
                                    :
                                    <IonList inset={true}>
                                      <IonItem>
                                        <IonLabel>
                                          No card found
                                        </IonLabel>
                                      </IonItem>
                                      </IonList>
                                  }
                                </IonRow>
                                <IonRow>
                                  <IonCol>
                                    <IonLabel className="ion-padding-vertical">
                                      <strong>Assigned Members</strong>
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
                                {/* I tried to implement the select thing but i couldn't so lol don't even worry about it rn */}
                                <IonSelect
                                  multiple={true}
                                  value={selectedMembers}
                                  onIonChange={(e) => setSelectedMembers(e.detail.value)}
                                >
                                  {members.map((member, index) => (
                                    <IonSelectOption key={index} value={member}>
                                      {member}
                                    </IonSelectOption>
                                  ))}
                                  Select Member
                                </IonSelect>
                                <IonRow className="edit-buttons">
                                  <IonCol>
                                {/* <IonItemOption color="danger" id="delete-panel-alert" onClick={() => handleDeletePanel(panel.id)}> */}
                                    <IonButton color="danger" id="delete-card-alert" onClick={() => handleDeleteCard(currentCard!.id)}>Delete</IonButton>
                                  </IonCol>
                                  {/* <IonCol>
              <IonButton color="tertiary">Save</IonButton>
            </IonCol> */}
                                </IonRow>
                                <IonAlert
                                  isOpen={deleteCardAlert}
                                  trigger="delete-card-alert"
                                  header="Are you sure you want to delete this card?"
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
                                      console.log('delete clicked')
                                      deleteCard(currentCard!);
                                    }
                                    setDeleteCardAlert(false);
                                  }}
                                />
                              </IonGrid>
                            </IonContent>
                          </IonModal>
                        )
                      }
                    </IonCard >
                  </SwiperSlide>
                  {index === stacks.length - 1 && (
                    <SwiperSlide key={index}>
                      {/* <NewStack
                        panelId={panelId}
                        orgId={orgId}
                        boardId={boardId}
                        hasStacks={true}
                        getBoard={getDetailedBoard}
                      /> */}
                      <IonCard className="ion-padding">
            <IonCardHeader>
                {!stacks ? <IonCardTitle>No stacks were found</IonCardTitle>
                    :
                    <IonCardTitle>Create new stack</IonCardTitle>
                }
            </IonCardHeader>
            <IonButton id="add-stack" fill="clear">
                <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
            <IonAlert
                trigger="add-stack"
                header="What are do you want the stack to be called?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Alert cancelled')
                        }
                    },
                    {
                        text: 'Create new stack',
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
                        createStack(title);
                    }
                }}
            />
        </IonCard>
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