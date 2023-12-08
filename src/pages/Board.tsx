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
  IonToggle,
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

import MemberList from "../components/MemberList";
import { serverAdress } from "../auth.config";
import "./Board.css";
import { useAuth0 } from "@auth0/auth0-react";

import { Stack, type Board, type Panel, type User, Card } from "../types"
import { RouteComponentProps, useHistory } from "react-router";
import NewStack from "../components/NewStack";
import { OverlayEventDetail } from "@ionic/core";
import NewPanel from "../components/NewPanel";
import NewCard from "../components/NewCard";
import StackSettings from "../components/StackSettings";

/*  Interfaces  */

interface BoardDetailPageProps
  extends RouteComponentProps<{ orgId: string, boardId: string }> { };

interface ButtonProps {
  text: string;
  data: {};
}

interface ActionSheetProps {
  text: string;
  data: {};
  role?: string;
  handler?: () => boolean | void | Promise<boolean | void>;
}

interface UpdatePanelProps {
  title?: string;
  position?: number;
}

interface UpdateCardProps {
  title?: string;
  description?: string;
  points?: string | number;
  position?: number;
  stack_id: string
}

interface UpdateBoardProps {
  title?: string;
  description?: string;
  is_private?: string | number;
}

const Board: React.FC<BoardDetailPageProps> = ({ match }) => {

  /*  Global Constants  */


  const orgId: string = match.params.orgId;
  const boardId: string = match.params.boardId;
  const history = useHistory();
  const { getAccessTokenSilently, user } = useAuth0();
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);
  const userId = user?.sub;
  const members = ["Member 1", "Member 2", "Member 3"];  // temp


  /*   States   */


  const [detailedBoard, setDetailedBoard] = useState<Board>();
  const [board, setBoard] = useState<Board>();
  const [boardOwnerId, setBoardOwnerId] = useState<string>();
  const [panels, setPanels] = useState<Panel[]>();
  const [detailedPanels, setDetailedPanels] = useState<Panel[]>();
  const [currentPanelIndex, setCurrentPanelIndex] = useState<number | null>(null);
  const [currentPanelId, setCurrentPanelId] = useState<string>('');
  const [isSelectStackDisabled, setIsSelectStackDisabled] = useState(true);
  const [panelViewButtons, setPanelViewButtons] = useState<ButtonProps[]>([]);
  const [stacks, setStacks] = useState<Stack[]>();
  const [detailedStacks, setDetailedStacks] = useState<Stack[]>();
  const [currentStack, setCurrentStack] = useState<Stack>();
  const [panelViewIsOpen, setPanelViewIsOpen] = useState(false);
  const [deletePanelAlert, setDeletePanelAlert] = useState(false);
  const [deleteBoardAlert, setDeleteBoardAlert] = useState(false);
  const [deleteCardAlert, setDeleteCardAlert] = useState(false);
  const [panelIdToDelete, setPanelIdToDelete] = useState<string | null>(null);
  const [panelModal, setPanelModal] = useState(false);
  const [boardModal, setBoardModal] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [cards, setCards] = useState<Card[]>();
  const [currentCard, setCurrentCard] = useState<Card>();
  const [selectedMembers, setSelectedMembers] = useState([]); // is this used?
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  const [boardIsPrivate, setBoardIsPrivate] = useState(detailedBoard?.is_private || false);

  /* //////////////////////////////
  
          Axios Requests 

  /////////////////////////////*/

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
        setDetailedBoard(data);
        setBoardOwnerId(data.owner_id);
        setBoardIsPrivate(data.is_private);
        setDetailedPanels(data.panels);
        if (typeof currentPanelIndex === null) {
          setCurrentPanelIndex(0);
        };
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getBoard = async () => { // may not need
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}`,
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
  };

  const updateBoard = async (data: UpdateBoardProps) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (data.title) { body.append('title', data.title) }
    if (data.description) { body.append('description', data.description) }
    if (data.is_private == 'true') { body.append('is_private', 'true') };
    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}`,
      headers: { authorization: `Bearer ${token}` },
      data: body
    };
    await axios(options)
      .then(() => {
        getDetailedBoard();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const deleteBoard = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}`,
      headers: { authorization: `Bearer ${token}` },
    };
    await axios(options)
      .then(() => {
        dismiss();
        history.push(`/app/myorgs/organizations/${orgId}`);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

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
  };

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
        getBoardMembers();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const deleteBoardMember = async (userId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/members`,
      headers: { authorization: `Bearer ${token}` },
      data: {
        "user_id": userId
      }
    };
    await axios(options)
      .then(() => {
        getBoardMembers();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getPanels = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data = response.data as Panel[];
        setPanels(data);
        const panelViewOptions: ActionSheetProps[] = data.map((panel) => ({
          text: panel.title,
          data: {
            action: panel.position,
            id: panel.id
          }
        }));
        panelViewOptions.push({
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel'
          },
          handler: () => { }
        });
        setPanelViewButtons(panelViewOptions);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getDetailedPanel = async (panelId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/details`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data: Panel = response.data as Panel;
        // setDetailedPanel(data);
        setDetailedStacks(data.stacks);
        return data;
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getPanel = async (panelId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data = response.data as Panel;
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

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
        getPanels();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const deletePanel = async (panelId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}`,
      headers: { authorization: `Bearer ${token}` },
    };
    await axios(options)
      .then(() => {
        getPanels();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getStacks = async (panelId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data = response.data as Stack[];
        setStacks(data)
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getStack = async (panelId: string, stackId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stackId}`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data = response.data as Stack;
        setCurrentStack(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const createStack = async (title: string, panelId: string) => {
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
          getDetailedPanel(panelId);
        })
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getCards = async (panelId: string, stackId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stackId}/cards`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data = response.data as Card[];
        setCards(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const getCard = async (cardId: string, panelId: string, stackId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stackId}/cards/${cardId}`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then((response) => {
        const data = response.data as Card;
        setCurrentCard(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const updateCard = async (cardId: string, panelId: string, data: UpdateCardProps) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    const stackId = data.stack_id;
    if (data.title) { body.append('title', data.title) }
    if (data.position) { body.append('position', data.position.toString()) }
    if (data.description) { body.append('description', data.description) }
    if (data.points && typeof data.points === "string") {
      body.append('points', data.points)
    } else if (data.points) { body.append('points', data.points.toString()) }
    const options = {
      method: "PUT",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stackId}/cards/${cardId}`,
      headers: { authorization: `Bearer ${token}` },
      data: body
    };
    await axios(options)
      .then(() => {
        getDetailedPanel(panelId);
        getCard(cardId, panelId, stackId);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const deleteCard = async (cardId: string, panelId: string, stackId: string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "DELETE",
      url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stackId}/cards/${cardId}`,
      headers: { authorization: `Bearer ${token}` }
    };
    await axios(options)
      .then(async () =>
        await getAccessTokenSilently().then(() => {
          getDetailedPanel(panelId);
        }))
      .catch((error) => {
        console.error(error.message);
      });
  };

  /*  {3 more requests to make in postman for assignments} */

  /* //////////////////////////////
  
          Handlers 

  /////////////////////////////*/

  const dismiss = () => {
    modal.current?.dismiss();
    setBoardModal(false);
    setPanelModal(false);
    setCardModal(false);
  };

  const onWillDisimss = (event: CustomEvent<OverlayEventDetail>) => {  // probably not needed
    dismiss();
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getDetailedBoard(); // may want to be something else but this is fine for now
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
  };

  const handleUpdateBoard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let possible_new_title;
    let possible_new_is_private;
    let possible_new_description;
    let body: UpdateBoardProps = { 'title': detailedBoard!.title, 'description': detailedBoard!.description, 'is_private': detailedBoard!.is_private.toString() }

    if ((event.target as any)[`board_title_id_${detailedBoard!.id}`].value !== detailedBoard!.title) {
      possible_new_title = (event.target as any)[`board_title_id_${detailedBoard!.id}`].value;
      body.title = possible_new_title;
    };
    if ((event.target as any)[`board_description_id_${detailedBoard!.id}`].value !== detailedBoard!.description) {
      possible_new_description = (event.target as any)[`board_description_id_${detailedBoard!.id}`].value;
      body.description = possible_new_description;
    };
    if ((event.target as any)[`board_is_private_id_${detailedBoard!.id}`].value === 'on') {
      possible_new_is_private = 'true';
      body.is_private = possible_new_is_private;
    };
    console.log('Toggle checked:', (event.target as any)[`board_is_private_id_${detailedBoard!.id}`].checked);
    console.log('detailedBoard is_private:', detailedBoard!.is_private);


    if (body.description !== detailedBoard?.description ||
      body.title !== detailedBoard?.title ||
      body.is_private !== detailedBoard?.is_private) {
      updateBoard(body);
    };
  };

  // TODO: implement server requests and other logic
  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    console.log("dragged from index", event.detail.from, "to", event.detail.to);
    event.detail.complete();
  };

  const handleDeletePanel = (panelId: string) => {
    setDeletePanelAlert(true)
    setPanelIdToDelete(panelId);
  };

  const handleDeleteBoard = () => {
    dismiss();
    setDeleteBoardAlert(true)
  };

  const handleCardClick = (card: Card, stack: Stack) => {
    setCurrentCard(card);
    setCurrentStack(stack);
    setCardModal(true);
  };

  const handleCardSettingsPanelSelect = (panel: Panel) => {
    setStacks(panel.stacks)
  };

  const handleUpdateCard = (event: React.FormEvent<HTMLFormElement>, card: Card) => {
    event.preventDefault();
    let possible_new_title;
    let possible_new_description;
    let possible_new_stack_id = (event.target as any)[`card_stack_id_${card.id}`].value;
    let possible_new_points;
    let possible_new_position;
    let body: UpdateCardProps = { 'title': undefined, 'description': undefined, 'points': undefined, 'position': undefined, 'stack_id': card.stack_id }
    const cardId = card.id;
    const panelId = panels![currentPanelIndex!].id;
    if ((event.target as any)[`card_title_id_${card.id}`].value !== card.title) {
      possible_new_title = (event.target as any)[`card_title_id_${card.id}`].value;
      body.title = possible_new_title;
    };
    if ((event.target as any)[`card_description_id_${card.id}`].value !== card.description) {
      possible_new_description = (event.target as any)[`card_description_id_${card.id}`].value;
      body.description = possible_new_description;
    };
    if(possible_new_stack_id !== body.stack_id) {
      body.stack_id = possible_new_stack_id;
    }
    console.log(body.stack_id)

    // haven't added these into the card settings yet so these will cause it not to work if uncommented

    // if ((event.target as any)[`card_points_id_${card.id}`].value !== card.points) {
    //     possible_new_points = (event.target as any)[`card_points_id_${card.id}`].value;
    //     body.title = possible_new_points;
    // };
    // if ((event.target as any)[`card_position_id_${card.id}`].value !== card.position) {
    //     possible_new_position = (event.target as any)[`card_position_id_${card.id}`].value;
    //     body.description = possible_new_position;
    // };

    if (body.description !== '' || body.title !== '') {
      updateCard(cardId, panelId, body);
    };
  };

  const handleDeleteCard = (cardId: string) => {
    setDeleteCardAlert(true);
  };

  /* //////////////////////////////
  
          useEffect Hooks 

  /////////////////////////////*/


  useEffect(() => { // on first load: fix this
    setPresentingElement(page.current);
    setCurrentPanelIndex(0);
    getDetailedBoard().then(() => {
    });
  }, []);

  useEffect(() => {
    getPanels().then(() => {
      if (panels && panels.length > 0) {
        const panelViewOptions: ActionSheetProps[] = panels.map((panel) => ({
          text: panel.title,
          data: {
            action: panel.position,
            id: panel.id
          }
        }));
        panelViewOptions.push({
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel'
          },
          handler: () => { }
        });
        setPanelViewButtons(panelViewOptions);
      };
    });
  }, [detailedBoard, detailedPanels]);

  useEffect(() => {
    try {
      if (detailedPanels && typeof currentPanelIndex === 'number' && detailedPanels.length > 0) {
        getDetailedPanel(detailedPanels[currentPanelIndex].id).then(() => {
          setCurrentPanelId(detailedPanels[currentPanelIndex].id);
        });
      }
    } catch (error) {
      console.error(error)
    }
  }, [detailedPanels, currentPanelIndex]);

  useEffect(() => {
    if (stacks) {
      if (stacks.length > 0) {
        setIsSelectStackDisabled(false);
      }
      else {
        setIsSelectStackDisabled(true)
      }
    }

  }, [stacks]);

  return (
    <IonPage ref={page}>
      <IonHeader collapse="condense">
        <div className="toolbar-shrink">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/app"
                className="ion-margin-vertical"
              />
            </IonButtons>
            <IonTitle>{detailedBoard?.title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setBoardModal(true)} slot="icon-only">
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>

            {/* Board Modal */}

            <IonModal
              ref={modal}
              isOpen={boardModal}
              onWillDismiss={(event) => onWillDisimss(event)}
              presentingElement={presentingElement!}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Board Settings</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setBoardModal(false)}>Close</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonGrid>
                  <IonRow>
                    <IonLabel className="ion-padding-vertical">
                      <strong>Actions</strong>
                    </IonLabel>
                  </IonRow>
                  <form onSubmit={(event) => handleUpdateBoard(event)} className="ion-nowrap">
                    <IonList inset={true}>
                      <IonItem>
                        <IonInput label="Title:" value={detailedBoard?.title} name={`board_title_id_${detailedBoard?.id}`} />
                      </IonItem>
                      <IonItem>
                        <IonTextarea rows={3} autoGrow={true} label="Description:" value={detailedBoard?.description} name={`board_description_id_${detailedBoard?.id}`} />
                      </IonItem>
                      <IonItem>
                        <IonToggle checked={boardIsPrivate} name={`board_is_private_id_${detailedBoard?.id}`}>Private:</IonToggle>
                      </IonItem>
                    </IonList>
                    <IonRow className="ion-padding-start">
                      <IonButton color="tertiary" type="submit" size="small">Save</IonButton>
                    </IonRow>
                  </form>
                  <IonRow>
                    <IonLabel className="ion-padding-vertical">
                      <strong>Board Members</strong>
                    </IonLabel>
                  </IonRow>
                  <IonList inset={true}>
                    <MemberList />
                    <MemberList />
                    <MemberList />
                  </IonList>
                  <IonRow className="ion-justify-content-center ion-padding">
                    <IonButton size="small" color="danger" id="delete-board-alert" onClick={() => { handleDeleteBoard }}>Delete Board</IonButton>
                  </IonRow>
                  <IonAlert
                    isOpen={deleteBoardAlert}
                    trigger="delete-board-alert"
                    header="Are you sure you want to delete this board?"
                    subHeader="This action cannot be undone."
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
                        deleteBoard();
                      }
                      setDeletePanelAlert(false);
                    }}
                  />
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
              className="ion-justify-content-center" >
              <IonIcon slot="end" icon={chevronDownOutline} />
              <strong>{detailedPanels && typeof currentPanelIndex === 'number' ? detailedPanels[currentPanelIndex]?.title : 'Choose a panel'}</strong>
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
            <IonActionSheet
              isOpen={panelViewIsOpen}
              header="Choose Board View"
              buttons={panelViewButtons}
              onDidDismiss={({ detail }) => {
                if (detail.role === "backdrop" || detail.role === "cancel") { }
                else {
                  setCurrentPanelIndex(detail.data.action);
                }
                setPanelViewIsOpen(false);
              }}
            />

            {/* Panel Modal */}

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
              <IonContent className="ion-padding">
                <IonGrid>
                  <form onSubmit={(event) => handleUpdatePanel(event)}>
                    <IonRow className="ion-justify-content-center">
                      <IonListHeader>{detailedBoard?.title}'s panels</IonListHeader>
                      <IonList inset={true} >
                        {panels && panels.length > 0 ? (
                          panels.map((panel, index) => (
                            <IonItemSliding key={index}>
                              <IonItem key={panel.id}>
                                <IonInput label="Panel title:" placeholder='Sprint 1' value={panel.title} name={`panel_name_id_${panel.id}`} />
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
                      <NewPanel orgId={orgId} boardId={boardId} getDetailedBoard={getDetailedBoard} />
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

      {/* end of header  */}

      <IonContent fullscreen>
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
          {detailedStacks && detailedStacks.length > 0 ? (
            detailedStacks.map((stack, index: number) => (
              <>
                <SwiperSlide key={stack?.id || ''}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{stack?.title || ''}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList inset={true}>
                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                          {detailedStacks[index].cards && detailedStacks[index].cards!.length > 0 ? (
                            detailedStacks[index].cards!.map((card: Card, i) => (
                              <IonItem key={card?.id} onClick={() => handleCardClick(card, stack)} lines="inset">
                                <IonLabel>{card?.title}</IonLabel>
                                <IonReorder slot="end"></IonReorder>
                              </IonItem>
                            ))
                          ) : (
                            <IonItem >
                              <IonLabel>This stack has no cards</IonLabel>
                            </IonItem>
                          )}
                        </IonReorderGroup>
                      </IonList>
                    </IonCardContent>
                    {
                      userId === boardOwnerId ? (
                        <StackSettings
                          stack={stack}
                          orgId={orgId}
                          boardId={boardId}
                          getDetailedBoard={getDetailedBoard}
                          detailedBoard={detailedBoard!}
                          detailedPanels={detailedPanels!}
                        />
                      )
                        :
                        <></>
                    }
                    <NewCard
                      stack={stack}
                      orgId={orgId}
                      boardId={boardId}
                      getDetailedBoard={getDetailedBoard}
                      detailedBoard={detailedBoard!}
                      detailedPanels={detailedPanels!}
                    />

                    {/* Card Modal */}

                    {
                      currentCard && (
                        <IonModal
                          ref={modal}
                          isOpen={cardModal}
                          onWillDismiss={(event) => onWillDisimss(event)}
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
                              </IonRow>
                              {currentCard ?
                                <form onSubmit={(event) => handleUpdateCard(event, currentCard)}>
                                  <IonList inset={true}>
                                    <IonItem>
                                      <IonInput label="Card Title:" value={currentCard.title} name={`card_title_id_${currentCard.id}`} />
                                    </IonItem>
                                    <IonItem>
                                      <IonTextarea rows={3} autoGrow={true} label="Description:" value={currentCard.description} name={`card_description_id_${currentCard.id}`} />
                                    </IonItem>
                                    <IonItem>
                                      <IonLabel>Points:</IonLabel>{currentCard.points}
                                    </IonItem>
                                    {detailedPanels || currentPanelIndex ?
                                      <>
                                        <IonItem>
                                          <IonSelect interface="popover" label="Panel:" placeholder={detailedPanels![currentPanelIndex!].title} onIonChange={(event) => handleCardSettingsPanelSelect(event.detail.value)} name={`card_panel_id_${currentCard.id}`}>
                                            {detailedPanels ? (
                                              detailedPanels.map((panel) => (
                                                <IonSelectOption value={panel}>{panel.title}</IonSelectOption>
                                              )))
                                              :
                                              <></>
                                            }
                                          </IonSelect>
                                        </IonItem>
                                        <IonItem>
                                          <IonSelect disabled={isSelectStackDisabled} interface="popover" label="Stack:" placeholder={currentStack?.title} name={`card_stack_id_${currentCard.id}`}>
                                            {stacks ? (
                                              stacks.map((stack) => (
                                                <IonSelectOption value={stack.id}>{stack.title}</IonSelectOption>
                                              )))
                                              :
                                              <></>
                                            }
                                          </IonSelect>
                                        </IonItem>
                                      </>
                                      :
                                      <></>
                                    }
                                  </IonList>
                                  <IonRow className="ion-justify-content-end ion-padding-end-bottom">
                                    <IonButton disabled={isSelectStackDisabled} color="tertiary" size="small" type="submit">Save</IonButton>
                                  </IonRow>
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
                              <IonRow>
                                <IonCol>
                                  <IonLabel className="ion-padding-vertical">
                                    <strong>Assigned Members</strong>
                                  </IonLabel>
                                </IonCol>
                                <div className="add-member-button">
                                  <IonButton size="small" fill="clear">
                                    <IonIcon slot="icon-only" icon={addOutline} />
                                  </IonButton>
                                </div>
                              </IonRow>
                              <IonList inset={true}>
                                <MemberList />
                                <MemberList />
                                <MemberList />
                              </IonList>
                              <IonRow className="ion-justify-content-center ion-padding" >
                                <IonButton size="small" color="danger" id="delete-card-alert" onClick={() => handleDeleteCard(currentCard!.id)}>Delete</IonButton>
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
                                    deleteCard(currentCard!.id, stack.panel_id, stack.id);
                                  }
                                  setDeleteCardAlert(false);
                                }}
                              />
                            </IonGrid>
                          </IonContent>
                        </IonModal>
                      )}
                  </IonCard >
                </SwiperSlide >
                {index === detailedStacks.length - 1 && (
                  <SwiperSlide key={index}>
                    <IonCard className="ion-padding">
                      <IonCardHeader>
                        {!detailedStacks || detailedStacks.length <= 0 ? <IonCardTitle>No stacks were found</IonCardTitle>
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
                            createStack(title, stack.panel_id);
                          };
                        }}
                      />
                    </IonCard>
                  </SwiperSlide>
                )}
              </>
            ))
          )
            :
            <SwiperSlide>
              <NewStack
                panelId={currentPanelId}
                orgId={orgId}
                boardId={boardId}
                hasStacks={false}
                getDetailedBoard={getDetailedBoard}
                detailedBoard={detailedBoard!}
                detailedPanels={detailedPanels!}
              />
            </SwiperSlide>
          }
        </Swiper>
      </IonContent>
    </IonPage >
  );
};

export default Board;