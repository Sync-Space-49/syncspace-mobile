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
} from "@ionic/react";
import MemberList from "./MemberList";
import { useEffect, useRef, useState } from "react";
import { addOutline } from "ionicons/icons";
import { Card } from "../types";

interface ItemModalProps {
  card: Card;
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onOpenChange, card }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  // const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const page = useRef(undefined);
  const modal = useRef<HTMLIonModalElement>(null);
  const [opened, setOpened] = useState(isOpen);

  const members = ["Member 1", "Member 2", "Member 3"];

  const dismiss = () => {
    modal.current?.dismiss();
    setOpened(false);
  };

  const present = () => {
    modal.current?.present();
  };

  useEffect(() => {
    // setPresentingElement(page.current);
  }, []);

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
            <IonCol />
            <IonCol>
              <IonButton color="tertiary">Save</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default ItemModal;
