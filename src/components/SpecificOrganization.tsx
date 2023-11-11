import React, { useEffect, useState } from "react";
import CustomList from "./CustomList";
import type { Board, Organization } from "../types";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";
interface SpecificOrganizationProps {
    org: Organization;
}

const SpecificOrganization: React.FC<SpecificOrganizationProps> = (org) => {
    const { getAccessTokenSilently, user } = useAuth0();
    const [isLoading, setIsLoading] = useState(false);
    const [boardIds, setBoardIds] = useState([]);
    const [boards, setBoards] = useState<Board[]>([]);

    let boardNames: string[] = [];

    const getBoardIds = async () => {
        setIsLoading(true);
        let token = await getAccessTokenSilently();
        let organizationId = org.org.id;
        const options = {
            method: "GET",
            url: `${serverAdress}api/organizations/${organizationId}/boards`,
            headers: { authorization: `Bearer ${token}` },
        };

        await axios(options)
            .then((response) => {
                const data = response.data;
                console.log("board data: " + data);
                // boardIds.push(data);
                setBoardIds(data);
                console.log("boardIds from getBoardIds: " + boardIds);
                console.log("boardIds.length from getBoardIds: " + boardIds.length);
            })
            .catch((error) => {
                console.log(error);
            });
        setIsLoading(false);
    };

    const getBoards = async (id: String) => {
        let organizationId = org.org.id;
        setIsLoading(true);
        let token = await getAccessTokenSilently();
        console.log("boardIds length: " + boardIds.length);
        console.log("boardIds ?: " + boardIds);
        // if(boardIds.length > 0) {
        // for (let i = 0; i > boardIds.length; i++) {
        const options = {
            method: "GET",
            url: `${serverAdress}api/organizations/${organizationId}/boards/${id}`,
            headers: { authorization: `Bearer ${token}` },
        };
        await axios(options)
            .then((response) => {
                let data: Board = response.data;
                console.log("getBoards data.title: " + data.title);
                boardNames.push(data.title);
                let tempBoards = boards;
                tempBoards.push(data);
                setBoards(tempBoards);
            })
            .catch((error) => {
                console.error(error.message);
            });
        // }
        // }
        setIsLoading(false);
    };

    useEffect(() => {
        getBoardIds();
    }, []);

    useEffect(() => {
        // console.log('org.org.id: ' + org.org.id);
        // console.log('boardIds.length: ' + boardIds.length);
        console.log("boardIds from useEffect b4 getboards: " + boardIds);
        for (let i = 0; i < boardIds.length; i++) {
            getBoards(boardIds[i]);
        }
        if (boardIds.length > 0) {
            let currentBoard = "";
            console.log("boardNames length: " + boardNames.length);
            for (let i = 0; i < boardNames.length; i++) {
                currentBoard = boardNames[i];
                console.log("current board: " + currentBoard);
                <p>this is a test</p>;
            }
        }
    }, [boardIds]);

    return (
        <>
            {boards.map((board, i) => {
                return (
                    <CustomList
                        key={i}
                        title={org.org.name}
                        titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
                        items={[
                            {
                                text: board.title,
                                listImg:
                                    "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
                            },
                        ]}
                    />
                );
            })}
        </>
    );
};

export default SpecificOrganization;
