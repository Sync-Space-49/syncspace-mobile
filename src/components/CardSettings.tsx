import {
  IonModal,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonTextarea,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonCol,
  IonGrid,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonToggle,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import MemberList from "./MemberList";
import { useRef, useState } from "react";
import { addOutline } from "ionicons/icons";

interface ItemModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, title, onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const pageRef = useRef<HTMLElement>(null);

  const members = ["Member 1", "Member 2", "Member 3"];

  return (
    <IonPage ref={pageRef}>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={onClose}
        presentingElement={pageRef.current || undefined}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Card Settings</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose}>Close</IonButton>
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
    </IonPage>
  );
};

export default ItemModal;
