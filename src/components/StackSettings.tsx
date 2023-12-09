import {
    IonButton,
    IonIcon,
    IonAlert,
} from "@ionic/react";
import { useState } from "react";
import { pencilOutline, trashOutline } from "ionicons/icons";
import { Board, Panel, Stack } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { serverAdress } from "../auth.config";

interface StackSettingsProps {
    stack: Stack;
    orgId: string;
    boardId: string;
    getDetailedBoard?: () => void;
    detailedBoard?: Board;
    detailedPanels?: Panel[];
}

const ItemModal: React.FC<StackSettingsProps> = ({ stack, orgId, boardId, getDetailedBoard }) => {
    const { getAccessTokenSilently } = useAuth0();

    const [editAlert, setEditAlert] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const panelId = stack.panel_id;

    const getStacks = async () => {
        const token = await getAccessTokenSilently();

        const options = {
            method: "GET",
            url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks`,
            headers: { authorization: `Bearer ${token}` },
        };

        await axios(options)
            .then(() => {
                if (getDetailedBoard) {
                    getDetailedBoard();
                }
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    const deleteStack = async () => {
        let token = await getAccessTokenSilently();
        const options = {
            method: "DELETE",
            url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stack.id}`,
            headers: { authorization: `Bearer ${token}` },
        }

        await axios(options)
            .then((response) => {
                if (getDetailedBoard) {
                    getDetailedBoard();
                }
            })
            .catch((error) => {
                console.error(error.message);
            })
    };

    const updateStack = async (title: string) => {
        const token = await getAccessTokenSilently();

        if (title !== stack.title) {

            const body = new FormData();
            body.append("title", title);

            const options = {
                method: "PUT",
                url: `${serverAdress}/api/organizations/${orgId}/boards/${boardId}/panels/${panelId}/stacks/${stack.id}`,
                headers: { authorization: `Bearer ${token}` },
                data: body
            };

            await axios(options)
                .then(() => {
                    if (getDetailedBoard) {
                        getDetailedBoard();
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    };

    const handleButtonClick = (stackId: string, editOrDelete: string) => {
        if (editOrDelete === "edit") { setEditAlert(true) }
        if (editOrDelete === "delete") { setDeleteAlert(true) }
    }

    return (
        <>
            <IonButton onClick={() => handleButtonClick(stack.id, "edit")} fill="clear" color="primary">
                <IonIcon slot="icon-only" icon={pencilOutline} />
            </IonButton>
            <IonButton onClick={() => handleButtonClick(stack.id, "delete")} fill="clear" color="danger">
                <IonIcon slot="icon-only" icon={trashOutline} />
            </IonButton>
            <IonAlert
                isOpen={editAlert}
                header="Edit"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Alert cancelled')
                        }
                    },
                    {
                        text: 'Confirm change',
                        role: 'confirm',
                    }
                ]}
                inputs={[
                    {
                        placeholder: stack.title,
                        attributes: {
                            maxLength: 255
                        }
                    }
                ]}
                onDidDismiss={({ detail }) => {
                    if (detail.role === 'confirm') {
                        let title = detail.data.values[0]
                        updateStack(title);
                    }
                    setEditAlert(false);
                }}
            />

            <IonAlert
                isOpen={deleteAlert}
                header="Are you sure you want to delete this stack?"
                buttons={[
                    {
                        text: "Cancel",
                        role: "cancel",
                    },
                    {
                        text: "Delete",
                        role: 'confirm',
                    },
                ]}
                onIonAlertDidDismiss={({ detail }) => {
                    if (detail.role === 'confirm') {
                        deleteStack();
                    }
                    setDeleteAlert(false);
                }}
            />
        </>
    );
};

export default ItemModal;
