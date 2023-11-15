import React, { useEffect, useState } from "react";
import CustomList from "./CustomList";
import type { Board, Organization } from "../types";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";
import { IonSpinner } from "@ionic/react";
interface SpecificOrganizationProps {
    org: Organization;
}

interface ListProps {
    text: string; // the list's content
    listImg?: string; //list image src
}

const SpecificOrganization: React.FC<SpecificOrganizationProps> = ({org}) => {
    const { getAccessTokenSilently, user } = useAuth0();
    const [boards, setBoards] = useState<Board[]>([]);
    const [boardNames, setBoardNames] = useState<ListProps[]>([]);
    const [loading, setIsLoading] = useState(false);

    const getBoards = async () => {
        setIsLoading(true);
        const token = await getAccessTokenSilently();
        const options = {
            method: "GET",
            url: `${serverAdress}api/organizations/${org.id}/boards`,
            headers: { authorization: `Bearer ${token}` },
        };
        await axios(options)
            .then((response) => {
                const data = response.data as Board[];
                setBoards(data);
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    useEffect(() => {
        getBoards();
    }, []);

    useEffect(() => {
        if (boards.length > 0) {
            const updatedBoardNames = boards.map((board) => ({
                text: board.title,
                listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
            }));
                setBoardNames(updatedBoardNames);
                setIsLoading(false);
            }
    }, [boards]);

    return (
        <>
            {loading ? <IonSpinner color="primary" className="ion-text-center ion-padding" />
                : boardNames.length > 0 ? 
                <CustomList
                    title={org.name}
                    titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
                    items={boardNames}
                /> : <p>nothing loaded</p>}
        </>
    );
};

export default SpecificOrganization;
