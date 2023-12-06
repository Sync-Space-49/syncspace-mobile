import {
    IonAlert,
    IonButton,
    IonIcon,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

interface NewPanelProps {
    orgId: string;
    boardId: string;
    getDetailedBoard?: () => void;
}

const NewPanel: React.FC<NewPanelProps> = ({ orgId, boardId, getDetailedBoard }) => {
    const { getAccessTokenSilently } = useAuth0();

    const [showAlert, setShowAlert] = useState(false);

    const createPanel = async (title: string) => {
        const token = await getAccessTokenSilently();
        const body = new FormData();
        body.append("title", title);

        const options = {
            method: "POST",
            url: `${serverAdress}api/organizations/${orgId}/boards/${boardId}/panels`,
            headers: { authorization: `Bearer ${token}` },
            data: body
        };

        await axios(options)
            .then(() => {
                getDetailedBoard!();
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
            <IonButton onClick={() => handleButtonClick()} className="ion-margin-bottom" size="small" shape="round" color={'success'}>
                <IonIcon icon={addOutline}></IonIcon>
                Add panel
            </IonButton>
            <IonAlert
                isOpen={showAlert}
                header="Fill out the panel's title"
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
                    }
                ]}
                onDidDismiss={({ detail }) => {
                    console.log(detail);
                    if (detail.role === 'confirm') {
                        let title = detail.data.values.title;
                        createPanel(title);
                    }
                    setShowAlert(false);
                }}
            />
        </>
    );
};

export default NewPanel;
