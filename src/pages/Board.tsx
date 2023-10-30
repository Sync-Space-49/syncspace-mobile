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
  IonAvatar,
  IonButton,
  IonImg,
  IonGrid,
  IonRow,
  IonToggle,
  IonInput,
  IonTextarea,
  IonCol,
  IonNote,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,

} from "@ionic/react";
import { addOutline, closeOutline, ellipsisHorizontal } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/pagination';

import BoardStack from "../components/BoardStack";
import MemberList from "../components/MemberList";
import "./Board.css";
import { useAuth0 } from "@auth0/auth0-react";

const Board: React.FC = () => {

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);

  const [canDismiss, setCanDismiss] = useState(false);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  function dismiss() {
    modal.current?.dismiss();
  }

  const { user } = useAuth0();

  return (
    <IonPage ref={page}>
      {/* <IonHeader>
          <IonToolbar>
            <IonTitle>SyncSpace Mobile</IonTitle>
          </IonToolbar>
        </IonHeader> */}
      <IonHeader collapse="fade">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app" className="ion-margin-vertical" />
          </IonButtons>
          {/* <IonTitle className="ion-padding">SyncSpace Mobile</IonTitle> */}
          <IonTitle>SyncSpace Mobile</IonTitle>
          <IonButtons slot="end">
            <IonButton id="open-modal" >
              <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
          <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Board Settings</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => dismiss()}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            {/* modal content */}
            <IonContent className="ion-padding">
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonToggle>Enable AI</IonToggle>
                </IonRow>
                <IonRow>
                  <IonLabel className="ion-padding-vertical"><strong>Actions</strong></IonLabel>
                  <form>
                    <IonList inset={true}>
                      <IonItem>
                        <IonInput label="Title:" placeholder="Backend" />
                      </IonItem>
                      <IonItem>
                        <IonTextarea rows={3} autoGrow={true} label="Description:" placeholder="A board dedicated to the backend team" />
                      </IonItem>
                    </IonList>
                  </form>
                </IonRow>
                <IonRow>
                  <IonCol >
                    <IonLabel className="ion-padding-vertical"><strong>Board Members</strong></IonLabel>
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
                <IonRow className="edit-buttons">
                  <IonCol>
                    <IonButton color="danger">
                      Delete
                    </IonButton>
                  </IonCol>
                  <IonCol />
                  <IonCol>
                    <IonButton color="tertiary" >
                      Save
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </IonModal>
        </IonToolbar>

        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </IonHeader>

      {/* end of modal and headers, beginning of Board page content */}

      <IonContent fullscreen>
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          style={{
            "--swiper-pagination-color": "#80e08b",
            "--swiper-pagination-bullet-inactive-color": "#92949c"
          }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
        >
          <IonContent className="ion-padding-end">
            <SwiperSlide>
              <BoardStack title="Backlog"></BoardStack>
            </SwiperSlide>
            <SwiperSlide>
              <BoardStack title="In-Progress"></BoardStack>
            </SwiperSlide>
            <SwiperSlide>
              <BoardStack title="Done"></BoardStack>
            </SwiperSlide>
          </IonContent>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Board;
