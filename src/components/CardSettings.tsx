import { IonModal, IonButton, IonContent } from "@ionic/react";

interface ItemModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, title, onClose }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent className="ion-padding">
        <h1>{title}</h1>
        <IonButton onClick={onClose}>Close</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default ItemModal;
