import React, { useEffect, useState } from "react";
import CustomList from "./CustomList";
import type { Board, Organization } from "../types";
import axios from "axios";
import { serverAdress } from "../auth.config";
import { useAuth0 } from "@auth0/auth0-react";
import { IonSpinner } from "@ionic/react";
interface SpecificOrganizationProps {
  org: Organization;
  updateOrgList: () => void;
}

interface ListProps {
  text?: string | null; // the list's content
  listImg?: string; //list image src
}

const SpecificOrganization: React.FC<SpecificOrganizationProps> = ({
  org,
  updateOrgList,
}) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardNames, setBoardNames] = useState<ListProps[]>([]);
  const [loading, setIsLoading] = useState(false);

  const getBoards = async () => {
    let organizationId = org.id;
    await getAccessTokenSilently({ cacheMode: "off" }).then(async (token) => {
      const options = {
        method: "GET",
        url: `${serverAdress}/api/organizations/${organizationId}/boards`,
        headers: { authorization: `Bearer ${token}` },
      };
      setIsLoading(true);
      let data: any;
      await axios(options)
        .then((response) => {
          console.log("SpecificOrganization, Boards fetched: ", response.data);
          data = response.data;
          setBoards(data);
          updateOrgList();
        })
        .catch((error) => {
          console.error(
            "SpecificOrganization, failed to fetch boards: ",
            error.message
          );
          console.error(error.message);
        });
    });
  };

  useEffect(() => {
    getBoards();
  }, []);

  useEffect(() => {
    if (boards && boards.length > 0) {
      const updatedBoardNames = boards.map((board) => ({
        text: board.title,
        listImg:
          "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
        boardId: board.id,
      }));
      setBoardNames(updatedBoardNames);
    } else {
      console.log("no boards");
      setBoardNames([]);
    }
    setIsLoading(false);
  }, [boards]);

  return (
    <>
      {loading ? (
        <IonSpinner color="primary" className="ion-text-center ion-padding" />
      ) : (
        <CustomList
          title={org.name}
          orgId={org.id}
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={boardNames}
        />
      )}
    </>
  );
};

export default SpecificOrganization;
