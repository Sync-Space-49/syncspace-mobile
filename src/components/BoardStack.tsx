import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonReorder,
  IonReorderGroup,
  ItemReorderEventDetail,
} from "@ionic/react";
import CardSettings from "../components/CardSettings";
import { useState } from "react";

interface Item {
  id: string;
  label: string;
}
interface StackProps {
  title: String;
  items: Item[];
  aiDisabled?: Boolean;
}

const BoardStack: React.FC<StackProps> = ({ title, items, aiDisabled }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  function handleReoder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log("dragged from index", event.detail.from, "to", event.detail.to);
    event.detail.complete();
  }

  return (
    <IonCard className="ion-padding">
      <IonCardTitle>{title}</IonCardTitle>
      <IonCardContent>
        <IonReorderGroup disabled={false} onIonItemReorder={handleReoder}>
          {items.map((item) => (
            <IonItem key={item.id} onClick={() => handleItemClick(item)}>
              <IonLabel>{item.label}</IonLabel>
              <IonReorder slot="end"></IonReorder>
            </IonItem>
          ))}
        </IonReorderGroup>
      </IonCardContent>
      {/* Modal */}
      {selectedItem && (
        <CardSettings
          title={selectedItem.label}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </IonCard>
  );
};

export default BoardStack;

{
  /* <IonItem>
            <IonLabel>Item 1</IonLabel>
            <IonReorder slot="end"></IonReorder>
          </IonItem>
          <IonItem>
            <IonLabel>Item 2</IonLabel>
            <IonReorder slot="end"></IonReorder>
          </IonItem>
          <IonItem>
            <IonLabel>Item 2</IonLabel>
            <IonReorder slot="end"></IonReorder>
          </IonItem>
          <IonItem>
            <IonLabel>Item 2</IonLabel>
            <IonReorder slot="end"></IonReorder>
          </IonItem>
          <IonItem>
            <IonLabel>Item 2</IonLabel>
            <IonReorder slot="end"></IonReorder>
          </IonItem> */
}
