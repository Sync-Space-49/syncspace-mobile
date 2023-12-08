import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonReorder,
  IonReorderGroup,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ItemReorderEventDetail,
} from "@ionic/react";
import CardSettings from "../components/CardSettings";
import { useEffect, useRef, useState } from "react";
import { Stack, Card, Board } from "../types";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth0 } from "@auth0/auth0-react";
import StackSettings from "./StackSettings";
import { addOutline, card } from "ionicons/icons";
import NewCard from "./NewCard";
import MemberList from "./MemberList";
import { serverAdress } from "../auth.config";
import axios from "axios";

interface Item {
  id: string;
  title: string;
}

interface StackProps {
  stack: Stack;
  orgId: string;
  boardId: string;
  ownerId: string;
  setBoard: (React.Dispatch<React.SetStateAction<Board | undefined>>);
}

interface UpdateCardProps {
  title?: string;
  description?: string;
  position?: number;
}

const BoardStack: React.FC<StackProps> = ({ stack, orgId, boardId, ownerId, setBoard }) => {

  const { user, getAccessTokenSilently } = useAuth0();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [title, setTitle] = useState<String>();


  const [cardModal, setCardModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [deleteCardAlert, setDeleteCardAlert] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

  const userId = user?.sub;
  const panelId = stack.panel_id;
  const members = ["Member 1", "Member 2", "Member 3"];


  const getDetailedBoard = async (token: string) => {
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

  const updateCard = async (data: UpdateCardProps, cardId: string) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (data.title) { body.append('title', data.title) }
    if (data.position) { body.append('position', data.position.toString()) }
    if (data.description) { body.append('description', data.description) }

    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stack.id}/cards/${cardId}`,
      headers: { authorization: `Bearer ${token}` },
      data: body
    };

    await axios(options)
      .then(async () => {
        await getAccessTokenSilently({ cacheMode: 'off' }).then((token) => {
          getDetailedBoard(token);
        })
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const deleteCard = async (cardId: string) => {
    const token = await getAccessTokenSilently();

    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stack.id}/cards/${cardId}`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then(async () => {
        await getAccessTokenSilently({ cacheMode: 'off' }).then((token) => {
          getDetailedBoard(token);
          setCardModal(false);
        })
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

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
      updateCard(body, card.id)
    }
  }

  const handleItemClick = (card: Card) => {
    console.log('clicked');
    setCurrentCard(card)
    setSelectedItem(card);
    setCardModal(true)
  };

  // need to update with position in server
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log("dragged from index", event.detail.from, "to", event.detail.to);
    event.detail.complete();
  }

  useEffect(() => {
    if (stack) {
      setTitle(stack.title);
      if (stack.cards.length > 0) {
        setCards(stack.cards);
      }
    }
  }, [stack]);

  useEffect(() => {
  }, [isModalOpen])

  return (
    // <IonCard className="ion-padding">
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList inset={true}>
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {cards && cards.length > 0 ? (
              cards.map((card: Card, i) => (
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
            onDidDismiss={() => setCardModal(false)}
          // presentingElement={presentingElement}
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
                    <IonButton color="danger" id="delete-card-alert">Delete</IonButton>
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
                      deleteCard(currentCard!.id);
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
  );
};

export default BoardStack;
