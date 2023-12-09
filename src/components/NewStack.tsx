import {
    IonAlert,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
} from "@ionic/react";
import "swiper/css";
import "swiper/css/pagination";
import { createOutline } from "ionicons/icons";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";
import { Board, Panel } from "../types";

interface NewStackProps {
    panelId: string | (() => void);
    orgId: string;
    boardId: string
    hasStacks: boolean;
    getDetailedBoard?: () => void;
    detailedBoard?: Board;
    detailedPanels?: Panel[];
}

const NewStack: React.FC<NewStackProps> = ({ hasStacks, panelId, orgId, boardId, getDetailedBoard, detailedBoard, detailedPanels }) => {

    const { getAccessTokenSilently } = useAuth0();

    const createStack = async (title: string) => {
        if (!panelId) {
            console.log("there is no panel");
        }
        const token = await getAccessTokenSilently();
        const body = new FormData();
        body.append("title", title);

        const options = {
            method: "POST",
            url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks`,
            headers: { authorization: `Bearer ${token}` },
            data: body,
        };

        await axios(options)
            .then(() => {
                getDetailedBoard!();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    return (
        <IonCard className="ion-padding">
            <IonCardHeader>
                {!hasStacks ? (
                    <IonCardTitle>No stacks were found</IonCardTitle>
                ) : (
                    <IonCardTitle>Create new stack</IonCardTitle>
                )}
            </IonCardHeader>
            <IonButton id="add-stack" fill="clear">
                <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
            <IonAlert
                trigger="add-stack"
                header="What are do you want the stack to be called?"
                buttons={[
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: () => {
                            console.log("Alert cancelled");
                        },
                    },
                    {
                        text: "Create new stack",
                        role: "confirm",
                    },
                ]}
                inputs={[
                    {
                        placeholder: "Title",
                        attributes: {
                            maxLength: 255,
                        },
                    },
                ]}
                onDidDismiss={({ detail }) => {
                    if (detail.role === "confirm") {
                        let title = detail.data.values[0];
                        createStack(title);
                    }
                }}
            />
        </IonCard>
    );
};

export default NewStack;
