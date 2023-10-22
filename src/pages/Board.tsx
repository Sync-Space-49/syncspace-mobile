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
  } from "@ionic/react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import "swiper/css";
import 'swiper/css/pagination';

import BoardStack from "../components/BoardStack";

  const Board: React.FC = () => {

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>SyncSpace Mobile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle>SyncSpace Mobile</IonTitle>
            </IonToolbar>
              <IonSearchbar />
          </IonHeader>
          <Swiper
            modules={[Pagination]}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            style= {{
              "--swiper-pagination-color": "#80e08b",
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
  