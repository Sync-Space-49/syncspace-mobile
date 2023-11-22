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
import { useEffect, useRef, useState } from "react";
import { Stack, Card } from "../types";
// import SpecificCard from "./SpecificCard";
import "swiper/css";
import "swiper/css/pagination";

interface Item {
  id: string;
  title: string;
}

interface StackProps {
  stack: Stack;
  updateStackList?: () => void;
}

const BoardStack: React.FC<StackProps> = ({ stack }) => {

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [title, setTitle] = useState<String>();

  // modal vars
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);

  const handleItemClick = (card: Card) => {
    console.log('clicked');
    // console.log(item);
    setCurrentCard(card)
    setSelectedItem(card);
    setIsModalOpen(true);
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
    console.log(isModalOpen);
  }, [isModalOpen])

  return (
    <IonCard className="ion-padding">
      <IonCardTitle>{title}</IonCardTitle>
      <IonCardContent>
        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
          {cards && cards.length > 0 ? (
            cards.map((card: Card, i) => (
              <IonItem key={card.id} onClick={() => handleItemClick(card)}>
                <IonLabel>{card.title}</IonLabel>
                <IonReorder slot="end"></IonReorder>
              </IonItem>
            ))
          ) : (
            <IonItem>
              <IonLabel>This stack has no cards</IonLabel>
            </IonItem>
          )}
        </IonReorderGroup>
      </IonCardContent>
      {/* Modal */}
      {selectedItem && (
        <CardSettings
          key={currentCard?.id}
          card={currentCard!}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
        />
      )}
    </IonCard>
  );
};

export default BoardStack;
