import {
    IonAlert,
    IonButton,
    IonIcon,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";
import { Board, Panel, Stack } from "../types";
import { useState } from "react";

interface NewCardProps {
    stack: Stack;
    orgId: string;
    boardId: string;
    getDetailedBoard?: () => void;
    detailedBoard?: Board;
    detailedPanels?: Panel[];
}

const NewCard: React.FC<NewCardProps> = ({ stack, orgId, boardId, getDetailedBoard, detailedBoard, detailedPanels }) => {
    const { getAccessTokenSilently } = useAuth0();

    const [showAlert, setShowAlert] = useState(false);

    const stackId = stack.id;
    const panelId = stack.panel_id;



    const createCard = async (title: string, description: string, points?: string) => {
        const token = await getAccessTokenSilently();
        const body = new FormData();
        body.append("title", title);
        body.append("description", description)
        if (points){body.append("points", points)}

        const options = {
            method: "POST",
            url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stackId}/cards`,
            headers: { authorization: `Bearer ${token}` },
            data: body
        };

        await axios(options)
            .then(() => {
                if(getDetailedBoard) {
                    getDetailedBoard();
                }
                console.log('created card')
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    const handleButtonClick = () => {
        setShowAlert(true)
    }


    return (
        <>
            <IonButton onClick={() => handleButtonClick()} fill="clear">Add Card
                <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
            </IonButton>
            <IonAlert
                isOpen={showAlert}
                header="Fill out the card's details"
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
                        name: 'title',
                        placeholder: 'Title',
                        attributes: {
                            maxLength: 255
                        }
                    },
                    {
                        name:'description',
                        type: 'textarea',
                        placeholder: 'Description'
                    },
                    {
                        name:'points',
                        placeholder: 'Story Points',
                        attributes: {
                            maxLength: 255
                        }
                    },
                ]}
                onDidDismiss={({ detail }) => {
                    console.log(detail);
                    if (detail.role === 'confirm') {
                        let title = detail.data.values.title;
                        let description = detail.data.values.description;
                        let points = detail.data.values.points;
                        createCard(title, description, points);
                    }
                    setShowAlert(false);
                }}
            />
        </>
    );
};

export default NewCard;
