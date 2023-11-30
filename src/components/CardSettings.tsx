import {
  IonModal,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonTextarea,
  IonLabel,
  IonList,
  IonRow,
  IonCol,
  IonGrid,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from "@ionic/react";
import MemberList from "./MemberList";
import { useEffect, useRef, useState } from "react";
import { addOutline } from "ionicons/icons";
import { Board, Card, Stack } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { serverAdress } from "../auth.config";
import axios from "axios";

interface ItemModalProps {
  stack: Stack;
  orgId: string;
  boardId: string;
  card: Card;
  isOpen: boolean;
  onClose?: () => void;
  setBoard: (React.Dispatch<React.SetStateAction<Board | undefined>>);
}

interface UpdateCardProps {
  title?: string;
  description?: string;
  position?: number;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, card, stack, boardId, orgId, setBoard }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [deleteCardAlert, setDeleteCardAlert] = useState(false);
  const [opened, setOpened] = useState(isOpen);

  const panelId = stack.panel_id;
  const page = useRef(undefined);
  const modal = useRef<HTMLIonModalElement>(null);

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

  const updateCard = async (data: UpdateCardProps) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (data.title) { body.append('title', data.title) }
    if (data.position) { body.append('position', data.position.toString()) }
    if (data.description) { body.append('description', data.description) }

    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stack.id}/cards/${card.id}`,
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
          setOpened(false);
        })
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const dismiss = () => {
    modal.current?.dismiss();
    setOpened(false);
  };

  const present = () => {
    modal.current?.present();
  };

  useEffect(() => {
    if (opened) {
      present();
    }
  }, [opened]);

  useEffect(() => {
    if (opened !== isOpen) {
      setOpened(isOpen);
    }
  }, [isOpen]);

  return (
    <IonModal
      // ref={modal}
      isOpen={opened}
      onDidDismiss={dismiss}
    // presentingElement={presentingElement}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Card Settings</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpened(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonLabel className="ion-padding-vertical">
              <strong>Details</strong>
            </IonLabel>
            <form>
              <IonList inset={true}>
                <IonItem>
                  <IonInput label="Title:" placeholder={card.title} />
                </IonItem>
                <IonItem>
                  <IonTextarea
                    rows={3}
                    autoGrow={true}
                    label="Description:"
                    placeholder={card.description}
                  />
                </IonItem>
              </IonList>
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
          </IonSelect>
          <IonRow className="edit-buttons">
            <IonCol>
              <IonButton color="danger" id="delete-card-alert">Delete</IonButton>
            </IonCol>
            <IonCol>
              <IonButton color="tertiary">Save</IonButton>
            </IonCol>
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
                deleteCard(card.id);
              }
              setDeleteCardAlert(false);
            }}
          />
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default ItemModal;
