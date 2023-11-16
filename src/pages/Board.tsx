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
  IonToggle,
  IonInput,
  IonTextarea,
  IonCol,
  IonNote,
  IonActionSheet,
} from "@ionic/react";
import {
  addOutline,
  ellipsisHorizontal,
  chevronDownOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import BoardStack from "../components/BoardStack";
import BoardView from "../components/BoardView";
import MemberList from "../components/MemberList";
import { serverAdress } from "../auth.config";
import "./Board.css";
import { useAuth0 } from "@auth0/auth0-react";
// import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";

import type { Board, Organization, User } from "../types"

interface BoardProps {
  org: Organization;
  board: Board;
}


const Board: React.FC<BoardProps> = ({org, board}) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(undefined);

  const [canDismiss, setCanDismiss] = useState(false); // prevents user from discarding unsaved changes
  const [presentingElement, setPresentingElement] = useState<
    HTMLElement | undefined
  >(undefined);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  function dismiss() {
    modal.current?.dismiss();
  }

  const { getAccessTokenSilently, user } = useAuth0();

  const getDetailedBoard = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${org.id}/boards/${board.id}/details`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then((response) => {
        const data = response.data as Board;
        return data;
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const updateBoard = async (title:string, ownerId:string, isPrivate:boolean) => {
    const token = await getAccessTokenSilently();
    const data = {} as any;
    if (title) { data.title = title }
    if (ownerId) { data.ownerId = ownerId }
    if (isPrivate) { data.isPrivate = isPrivate }
      
    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${org.id}/boards/${board.id}`,
      headers: { authorization: `Bearer ${token}` },
      data: data
    };

    await axios(options)
      .then(() => {
        // Not sure if you want to do something on success
        return
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const deleteBoard = async (title:string, ownerId:string, isPrivate:boolean) => {
    const token = await getAccessTokenSilently();
      
    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${org.id}/boards/${board.id}`,
      headers: { authorization: `Bearer ${token}` },
    };

    await axios(options)
      .then(() => {
        // Not sure if you want to do something on success
        return
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  // NOT IMPLEMENTED YET ON API
  const getBoardMembers = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${org.id}/boards/${board.id}/members`,
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
  }

  const addBoardMember = async (userId:string) => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "POST",
      url: `${serverAdress}api/organizations/${org.id}/boards/${board.id}/members`,
      headers: { authorization: `Bearer ${token}` },
      data : {
        "user_id": userId
      }
    };

    await axios(options)
      .then(() => {
        // Not sure if you want to do something on success
        return
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  // var for current view + handler to change
  // let boardView: String = 'Sprint 1';
  const [buttonText, setButtonText] = useState("Sprint 1");
  return (
    <IonPage ref={page}>
      <IonHeader collapse="fade">
        <div className="toolbar-shrink">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/app"
                className="ion-margin-vertical"
              />
            </IonButtons>
            <IonTitle>SyncSpace Mobile</IonTitle>
            <IonButtons slot="end">
              <IonButton id="open-modal">
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>
            <IonModal
              ref={modal}
              trigger="open-modal"
              presentingElement={presentingElement!}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Board Settings</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => dismiss()}>Close</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              {/* modal content */}
              <IonContent className="ion-padding" scroll-y="false">
                <IonGrid>
                  <IonRow className="ion-justify-content-center">
                    <IonToggle>Enable AI</IonToggle>
                  </IonRow>
                  <IonRow>
                    <IonLabel className="ion-padding-vertical">
                      <strong>Actions</strong>
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
                        <strong>Board Members</strong>
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
                  <IonRow className="edit-buttons">
                    <IonCol>
                      <IonButton color="danger">Delete</IonButton>
                    </IonCol>
                    <IonCol />
                    <IonCol>
                      <IonButton color="tertiary">Save</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
            </IonModal>
          </IonToolbar>
        </div>
        <div className="subtitle">
          <IonToolbar>
            <IonButton
              size="small"
              fill="clear"
              color="medium"
              id="open-action-sheet"
            >
              <IonIcon slot="end" icon={chevronDownOutline} />
              <strong>{buttonText}</strong>
            </IonButton>
            <IonActionSheet
              trigger="open-action-sheet"
              header="Choose Board View"
              buttons={[
                {
                  text: "Backlog",
                  data: {
                    action: "Backlog",
                  },
                },
                {
                  text: "Sprint 1",
                  data: {
                    action: "Sprint 1",
                  },
                },
                {
                  text: "Sprint 2",
                  data: {
                    action: "Sprint 2",
                  },
                },
                {
                  text: "Sprint 3",
                  data: {
                    action: "Sprint 3",
                  },
                },
                {
                  text: "Sprint 4",
                  data: {
                    action: "Sprint 4",
                  },
                },
                {
                  text: "Cancel",
                  role: "cancel",
                  data: {
                    action: "cancel",
                  },
                },
              ]}
              onDidDismiss={({ detail }) => setButtonText(detail.data.action)}
            />
          </IonToolbar>
        </div>

        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>
      </IonHeader>

      {/* end of modal and headers, beginning of Board page content */}

      <IonContent fullscreen scroll-y="false">
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          style={{
            "--swiper-pagination-color": "#80e08b",
            "--swiper-pagination-bullet-inactive-color": "#92949c",
          }}
        >
          <IonContent className="ion-padding-end">
            <SwiperSlide>
              <BoardStack
                title="Backlog"
                items={[
                  { id: "1", label: "Item A" },
                  { id: "2", label: "Item B" },
                  { id: "3", label: "Item C" },
                ]}
              ></BoardStack>
            </SwiperSlide>
            <SwiperSlide>
              <BoardStack
                title="In progress"
                items={[
                  { id: "1", label: "Item A" },
                  { id: "2", label: "Item B" },
                  { id: "3", label: "Item C" },
                ]}
              ></BoardStack>
            </SwiperSlide>
            <SwiperSlide>
              <BoardStack
                title="Done"
                items={[
                  { id: "1", label: "Item A" },
                  { id: "2", label: "Item B" },
                  { id: "3", label: "Item C" },
                ]}
              ></BoardStack>
            </SwiperSlide>
          </IonContent>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Board;
