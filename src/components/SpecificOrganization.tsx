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
  text?: string | null; // the list's content
  listImg?: string; //list image src
}

const SpecificOrganization: React.FC<SpecificOrganizationProps> = ({ org }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardNames, setBoardNames] = useState<ListProps[]>([]);
  const [loading, setIsLoading] = useState(false);

  const getBoards = async () => {
    let organizationId = org.id;
    let token = await getAccessTokenSilently();
    const options = {
      method: "GET",
      url: `${serverAdress}api/organizations/${organizationId}/boards`,
      headers: { authorization: `Bearer ${token}` },
    };
    setIsLoading(true);
    let data: any;
    await axios(options)
      .then((response) => {
        data = response.data;
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
    if (boards && boards.length > 0) {
      const updatedBoardNames = boards.map((board) => ({
        text: board.title,
        listImg:
          "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
      }));
      setBoardNames(updatedBoardNames);
    } else {
      console.log("no boards");
      //   const noBoards = [{}];
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
          titleImg="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png"
          items={boardNames}
        />
      )}
    </>
  );
};

export default SpecificOrganization;
