import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonPopover,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonBackButton,
  IonAlert,
  IonModal,
  IonSelect,
  IonLabel,
  IonInput,
  IonSelectOption,
  IonTextarea,
  IonRow,
  IonGrid,
} from "@ionic/react";
import CustomList from "../components/CustomList";
import { useEffect, useState } from "react";
import {
  addOutline,
  colorWandOutline,
  ellipsisHorizontal,
} from "ionicons/icons";
import { RouteComponentProps, useHistory } from "react-router";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { serverAdress } from "../auth.config";
import { Board, Organization } from "../types";
import { useRef } from "react";
import "./OrgDetails.css";
import MemberList from "../components/MemberList";
import { OverlayEventDetail } from "@ionic/core";

interface OrgDetailPageProps
  extends RouteComponentProps<{
    orgId: string;
  }> {}

interface ListProps {
  text: string; // the list's content
  listImg?: string; //list image src
  boardId: string;
}

const OrgDetail: React.FC<OrgDetailPageProps> = ({ match }) => {
  const { getAccessTokenSilently } = useAuth0();
  const orgId: string = match.params.orgId;

  const [organization, setOrganization] = useState<Organization>();
  const [boards, setBoards] = useState<Board[]>();
  const [viewableBoardsProps, setViewableBoardsProps] = useState<ListProps[]>(
    []
  );
  const [hiddenBoardsProps, setHiddenBoardsProps] = useState<ListProps[]>();
  const [showAlert, setShowAlert] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  //create AI board stuff
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState("true");
  const [detailLevel, setDetailLevel] = useState("");
  const [storyPointType, setStoryPointType] = useState("");
  const [storyPointExample, setStoryPointExample] = useState("");
  const [showCreateAIModal, setShowCreateAIModal] = useState(false);

  //org settings stuff
  const [orgSettingsModal, setOrgSettingsModal] = useState(false);
  const [deleteOrgAlert, setDeleteOrgAlert] = useState(false);
  const [presentingElement, setPresentingElement] = useState<
    HTMLElement | undefined
  >(undefined);
  const page = useRef(undefined);
  const [orgTitle, setOrgTitle] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [aiEnabled, setAiEnabled] = useState("true");

  const modal = useRef<HTMLIonModalElement>(null);

  const dismiss = () => {
    modal.current?.dismiss();
    setShowCreateAIModal(false);
    setOrgSettingsModal(false);
  };

  const onWillDisimss = (event: CustomEvent<OverlayEventDetail>) => {
    // probably not needed
    dismiss();
  };

  const customListTitle = `${organization?.name}'s boards`;
  const history = useHistory();

  const openCreateBoardAlert = () => {
    setShowAlert(true);
    setIsPopoverOpen(false);
  };

  const openCreateAIBoardModal = () => {
    setShowCreateAIModal(true);
    setIsPopoverOpen(false);
  };

  const handleDeleteOrganization = () => {
    dismiss();
    setDeleteOrgAlert(true);
  };

  const getOrganization = async () => {
    let token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
    };
    await axios(options)
      .then((response) => {
        const org = response.data;
        setOrganization(org);
        // setLoading(false);
      })
      .catch((error) => {
        console.log("failed to fetch organizations: ", error.message);
      });
  };

  const getBoards = async () => {
    let token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${orgId}/boards`,
      headers: { authorization: `Bearer ${token}` },
    };
    let data: any;
    await axios(options)
      .then((response) => {
        console.log("OrgDetail, Boards fetched: ", response.data);
        data = response.data;
        if (data === null) {
          setBoards([]);
        } else {
          setBoards(data);
        }
        // setLoading(false);
      })
      .catch((error) => {
        console.error("OrgDetail, failed to fetch boards: ", error.message);
        // setLoading(false);
      });
  };

  const createBoard = async (
    title: string,
    isPrivate: boolean,
    description: string
  ) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (title) {
      body.append("title", title);
    }
    body.append("isPrivate", isPrivate ? "1" : "0");
    if (description) {
      body.append("description", description);
    }
    console.log("Sending data:", body);

    const options = {
      method: "POST",
      url: `${serverAdress}api/organizations/${orgId}/boards`,
      headers: { authorization: `Bearer ${token}` },
      data: body,
    };

    await axios(options)
      .then(async (response) => {
        console.log("success, board created, response: ", response);
        const boardId = response.data.id;
        console.log("boardId: ", boardId);

        await getAccessTokenSilently().then(() => {
          getBoards();
        });

        setIsPopoverOpen(false);
      })
      .catch((error) => {
        console.error(
          "ERROR: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const createAIBoard = async (
    title: string,
    description: string,
    isPrivate: string,
    detailLevel?: string,
    storyPointType?: string,
    storyPointExample?: string
  ) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (title) {
      body.append("title", title);
    }
    if (description) {
      body.append("description", description);
    }
    if (isPrivate) {
      body.append("isPrivate", isPrivate);
    }
    if (detailLevel) {
      body.append("detailLevel", detailLevel);
    }
    if (storyPointType) {
      body.append("storyPointType", storyPointType);
    }
    if (storyPointExample) {
      body.append("storyPointExample", storyPointExample);
    }
    console.log("Sending data:", body);

    const options = {
      method: "POST",
      url: `${serverAdress}api/organizations/${orgId}/boards/ai`,
      headers: { authorization: `Bearer ${token}` },
      data: body,
    };

    await axios(options)
      .then(async (response) => {
        console.log("success, AI board created, response: ", response);

        await getAccessTokenSilently().then(() => {
          getBoards();
        });

        setIsPopoverOpen(false);
      })
      .catch((error) => {
        console.error(
          "ERROR: ",
          error.response ? error.response.data : error.message
        );
      });
  };

  const updateOrganization = async (
    title: string,
    description: string,
    ai_enabled: string
  ) => {
    const token = await getAccessTokenSilently();
    const body = new FormData();
    if (title) {
      body.append("title", title);
    }
    if (description) {
      body.append("description", description);
    }
    if (ai_enabled) {
      body.append("ai_enabled", ai_enabled);
    }
    const options = {
      method: "PUT",
      url: `${serverAdress}api/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
      data: body,
    };
    await axios(options)
      .then(() => {
        console.log("successfully updated organization");
        getOrganization();
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const deleteOrganization = async () => {
    const token = await getAccessTokenSilently();
    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
    };
    await axios(options)
      .then(() => {
        console.log("org has been deleted properly");
        dismiss();
        history.push(`/app/myorgs`);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleSubmit = async () => {
    await createAIBoard(
      title,
      description,
      isPrivate,
      detailLevel,
      storyPointType,
      storyPointExample
    );

    setShowCreateAIModal(false);
  };

  const handleNewAI = () => {
    setShowCreateAIModal(true);
    console.log("New board with AI clicked!");
  };
  const handleCreateBoard = () => {
    setShowAlert(true);
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    getBoards();
    event.detail.complete();
  };

  useEffect(() => {
    // setLoading(true);
    setPresentingElement(page.current);
    setOrganization(undefined);
    setBoards(undefined);
    getOrganization();
    getBoards();
  }, [orgId]);

  useEffect(() => {
    if (boards) {
      console.log("boards before processing: ", boards);
      let hiddenBoards = [];
      let nonHiddenBoards = [];

      for (let i = 0; i < boards.length; i++) {
        if (boards[i].is_private) {
          hiddenBoards.push(boards[i]);
        } else {
          nonHiddenBoards.push(boards[i]);
        }
      }

      // console.log("Hidden Boards:", hiddenBoards);
      // console.log("Non-Hidden Boards:", nonHiddenBoards);

      if (nonHiddenBoards && nonHiddenBoards.length > 0) {
        const viewableListProp = nonHiddenBoards.map((board) => ({
          text: board.title,
          boardId: board.id,
        }));
        setViewableBoardsProps(viewableListProp);
        console.log("Viewable Boards Props:", viewableListProp);
      }
      if (hiddenBoards && hiddenBoards.length > 0) {
        const privateListProp = hiddenBoards.map((board) => ({
          text: board.title,
          boardId: board.id,
        }));
        setHiddenBoardsProps(privateListProp);
        console.log("Hidden Boards Props:", privateListProp);
      }
    }
    if (boards && boards?.length <= 0) {
      setViewableBoardsProps([]);
    }
  }, [boards]);

  useEffect(() => {
    let example;
    switch (storyPointType) {
      case "fibonacci":
        example = "0, 1, 2, 3, 5";
        break;
      case "tshirt size":
        example = "XS, S, M, L, XL";
        break;
      case "1-5":
        example = "1, 2, 3, 4, 5";
        break;
      default:
        example = "";
    }
    setStoryPointExample(example);
  }, [storyPointType]);

  return (
    <IonPage ref={page}>
      <IonHeader collapse="condense">
        <div className="toolbar-shrink">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                defaultHref="/app"
                className="ion-margin-vertical"
              />
            </IonButtons>
            <IonTitle>{organization?.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => setOrgSettingsModal(true)}
                slot="icon-only"
              >
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>
            {/* Org Settings Modal */}
            <IonModal
              ref={modal}
              isOpen={orgSettingsModal}
              onWillDismiss={(event) => onWillDisimss(event)}
              presentingElement={presentingElement!}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Org Settings</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setOrgSettingsModal(false)}>
                      Close
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonGrid>
                  <IonRow>
                    <IonLabel className="ion-padding-vertical">
                      <strong>Actions</strong>
                    </IonLabel>
                  </IonRow>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      updateOrganization(title, description, aiEnabled);
                    }}
                    className="ion-nowrap"
                  >
                    <IonList inset={true}>
                      <IonItem>
                        <IonInput
                          label="Title:"
                          value={orgTitle}
                          onIonChange={(e) => setOrgTitle(e.detail.value!)}
                        />
                      </IonItem>
                      <IonItem>
                        <IonTextarea
                          rows={3}
                          autoGrow={true}
                          label="Description:"
                          value={orgDescription}
                          onIonChange={(e) =>
                            setOrgDescription(e.detail.value!)
                          }
                        />
                      </IonItem>
                      <IonItem>
                        <IonLabel position="stacked">Enable AI?</IonLabel>
                        <IonSelect
                          value={aiEnabled}
                          onIonChange={(e) => setAiEnabled(e.detail.value)}
                        >
                          <IonSelectOption value="true">True</IonSelectOption>
                          <IonSelectOption value="false">False</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonList>
                    <IonRow className="ion-padding-start">
                      <IonButton color="tertiary" type="submit" size="small">
                        Save
                      </IonButton>
                    </IonRow>
                  </form>
                  <IonRow>
                    <IonLabel className="ion-padding-vertical">
                      <strong>Org Members</strong>
                    </IonLabel>
                  </IonRow>
                  <IonList inset={true}>
                    <MemberList />
                    <MemberList />
                    <MemberList />
                  </IonList>
                  <IonRow className="ion-justify-content-center ion-padding">
                    <IonButton
                      size="small"
                      color="danger"
                      id="delete-board-alert"
                      onClick={() => {
                        handleDeleteOrganization;
                      }}
                    >
                      Delete Organization
                    </IonButton>
                  </IonRow>
                  <IonAlert
                    isOpen={deleteOrgAlert}
                    trigger="delete-board-alert"
                    header="Are you sure you want to delete this organization?"
                    subHeader="This action cannot be undone."
                    buttons={[
                      {
                        text: "Cancel",
                        role: "cancel",
                      },
                      {
                        text: "Delete",
                        role: "confirm",
                      },
                    ]}
                    onIonAlertDidDismiss={({ detail }) => {
                      if (detail.role === "confirm") {
                        deleteOrganization();
                      }
                      // setDeletePanelAlert(false);
                    }}
                  />
                </IonGrid>
              </IonContent>
            </IonModal>
          </IonToolbar>
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {/* Viewable Boards: */}
        <CustomList
          orgId={orgId}
          title={customListTitle}
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={viewableBoardsProps}
        />
        {/* Create Board (Viewable): */}
        <IonButton className="org-detail-btn" onClick={openCreateBoardAlert}>
          <IonIcon slot="start" icon={addOutline} />
          New board
        </IonButton>
        {/* Hidden Boards: */}
        <CustomList
          orgId={orgId}
          title="Hidden Boards"
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={hiddenBoardsProps}
        />
        {/* Create Board (Hidden): */}
        <IonButton className="org-detail-btn" onClick={openCreateAIBoardModal}>
          <IonIcon slot="start" icon={colorWandOutline} />
          New board with AI
        </IonButton>
        {/* Popover with Create options: */}
        <IonPopover
          isOpen={isPopoverOpen}
          onDidDismiss={() => setIsPopoverOpen(false)}
          dismissOnSelect={true}
          trigger="new-board-btn"
          triggerAction="click"
        >
          <IonList>
            <IonItem button={true} detail={false} onClick={handleCreateBoard}>
              New board
            </IonItem>
            <IonItem button={true} detail={false} onClick={handleNewAI}>
              <IonIcon slot="end" icon={colorWandOutline}></IonIcon>
              New board with AI
            </IonItem>
          </IonList>
        </IonPopover>
        {/* Create Board Inputs: */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Enter Board Name"
          buttons={[
            {
              text: "Finish",
              handler: (alertData) => {
                const title = alertData.title;
                const isPrivate = alertData.isPrivate;
                const description = alertData.description;
                createBoard(title, isPrivate, description);
              },
            },
          ]}
          inputs={[
            {
              name: "title",
              placeholder: "Title",
              type: "text",
            },
            {
              name: "isPrivate",
              placeholder: "isPrivate",
              type: "text",
            },
            {
              name: "description",
              placeholder: "description",
              type: "textarea",
            },
          ]}
        />
        {/* Create Board with AI Inputs: */}
        <IonModal isOpen={showCreateAIModal} onDidDismiss={dismiss}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Card Settings</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowCreateAIModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput
                value={title}
                onIonChange={(e) => setTitle(e.detail.value || "")}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea
                value={description}
                autoGrow={true}
                onIonChange={(e) => setDescription(e.detail.value || "")}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Is Private?</IonLabel>
              <IonSelect
                value={isPrivate}
                onIonChange={(e) => setIsPrivate(e.detail.value)}
              >
                <IonSelectOption value="true">True</IonSelectOption>
                <IonSelectOption value="false">False</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Detail Level</IonLabel>
              <IonSelect
                value={detailLevel}
                onIonChange={(e) => setDetailLevel(e.detail.value)}
              >
                <IonSelectOption value="brief">Brief</IonSelectOption>
                <IonSelectOption value="detailed">Detailed</IonSelectOption>
                <IonSelectOption value="very detailed">
                  Very Detailed
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Story Point Type</IonLabel>
              <IonSelect
                value={storyPointType}
                onIonChange={(e) => setStoryPointType(e.detail.value)}
              >
                <IonSelectOption value="fibonacci">Fibonacci</IonSelectOption>
                <IonSelectOption value="tshirt size">
                  T-Shirt Size
                </IonSelectOption>
                <IonSelectOption value="1-5">1-5</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton expand="block" onClick={handleSubmit}>
              Submit
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default OrgDetail;
