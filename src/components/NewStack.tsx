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
import { Board } from "../types";
import { useState } from "react";

interface NewStackProps {
    board: Board;
    panelId: string;
    orgId: string;
    boardId: string
    hasStacks: boolean;
    getBoard: (token: string) => void;
    handleRefresh?: () => void;
}

const NewStack: React.FC<NewStackProps> = ({ board, hasStacks, panelId, orgId, boardId, getBoard, handleRefresh }) => {

    const { getAccessTokenSilently } = useAuth0();
    const [currentBoard, setCurrentBoard] = useState(board);

    const createStack = async (title: string) => {
        const token = await getAccessTokenSilently();
        const body = new FormData();
        body.append("title", title);

        const options = {
            method: "POST",
            url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks`,
            headers: { authorization: `Bearer ${token}` },
            data: body
        };

        await axios(options)
            .then(async () => {
                await getAccessTokenSilently({ cacheMode: "off" }).then((token) => {
                    handleRefresh!();
                    getBoard(token);
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    return (
        <IonCard className="ion-padding">
            <IonCardHeader>
                {!hasStacks ? <IonCardTitle>No stacks were found</IonCardTitle>
                    :
                    <IonCardTitle>Create new stack</IonCardTitle>
                }
            </IonCardHeader>
            <IonButton id="add-stack" fill="clear">
                <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
            <IonAlert
                trigger="add-stack"
                header="What are do you want the stack to be called?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Alert cancelled')
                        }
                    },
                    {
                        text: 'Create new stack',
                        role: 'confirm',
                    }
                ]}
                inputs={[
                    {
                        placeholder: 'Title',
                        attributes: {
                            maxLength: 255
                        }
                    }
                ]}
                onDidDismiss={({ detail }) => {
                    if (detail.role === 'confirm') {
                        let title = detail.data.values[0]
                        createStack(title);
                    }
                }}
            />
        </IonCard>
    );
};

export default NewStack;
