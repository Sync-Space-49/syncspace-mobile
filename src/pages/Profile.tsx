import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
} from "@ionic/react";
import "./Profile.css";
import { IdToken, useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/Logout";
import DeleteButton from "../components/DeleteAccount";
import { serverAdress } from "../auth.config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Organization } from "../types";
import CustomList from "../components/CustomList";

interface ListProps {
  text: string; // the list's content
  listImg?: string; //list image src
}

const Profile: React.FC = () => {
  const { user, getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgNames, setOrgNames] = useState<ListProps[]>([]);
  const [userSince, setUserSince] = useState<string>('October 2023');

  const getOrgs = async () => {
    let token = await getAccessTokenSilently();
    let userId = user!.sub;
    const options = {
      method: "GET",
      url: `${serverAdress}api/users/${userId}/organizations`,
      headers: { authorization: `Bearer ${token}` },
    }

    await axios(options)
      .then((response) => {
        let data = response.data;
        setOrganizations(data);
      })
      .catch((error) => {
        console.error(error.message);
      })
  }

  useEffect(() => {
    getCreatedAt();
    getOrgs();
  }, []);

  const getCreatedAt = async () => {
    const data = user!.createdAt;
    const time: Date = new Date(data)
    const updatedTimeString = time.toLocaleString('default', { month: 'long', year: 'numeric' });
    setUserSince(updatedTimeString);
  }
  useEffect(() => {
    if (organizations.length > 0) {
      const updatedOrgNames = organizations.map((org) => ({
        text: org.name,
        listImg: "https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-mint.png",
      }));
      setOrgNames(updatedOrgNames);
    }
  }, [organizations]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="profile-image-container">
          <IonAvatar className="avatar">
            <img src={user?.picture} alt={user?.name} />
          </IonAvatar>
        </div>
        <div className="user-name">{user?.name}</div>
        <div className="user-at">{user?.nickname}</div>
        <div className="user-at">
          {/* replace with created_at */}
          <small>Member since {userSince}</small>
        </div>
        <div className="list-title">Your Organizations</div>
        <CustomList items={orgNames} />
        <div className="list-title">Actions</div>
        <IonList inset={true}>
          <IonItem>
            <IonLabel>Change Password</IonLabel>
          </IonItem>
          <LogoutButton />
          <DeleteButton />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
