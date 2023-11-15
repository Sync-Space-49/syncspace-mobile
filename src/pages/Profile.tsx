import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonAvatar,
  IonAlert,
  IonButton,
} from "@ionic/react";
import "./Profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/Logout";
import DeleteButton from "../components/DeleteAccount";
import { domain, serverAdress, serverAudience } from "../auth.config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Organization } from "../types";

const Profile: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userSince, setUserSince] = useState();

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

  const getUserSince = async () => {
    let token = await getAccessTokenSilently();
    let userId = user!.sub;
    const options = {
      method: "GET",
      url: `https://${domain}/api/v2/users/${userId}`,
      headers: { authorization: `Bearer ${token}` },
    }
    await axios(options)
      .then((response) => {
        let data = response.data;
        setUserSince(data);

      })
      .catch((error) => {
        console.error(error.message);
      })
  }

  useEffect(() => {
    getUserSince();
    getOrgs();
  },[]);

  // useEffect(() => {
  //   setOrganizations(data);
  //   setUserSince(data);
  // },[]); 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scroll-y="false">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* User Profile Pic */}
        <div className="profile-image-container">
          <IonAvatar className="avatar">
            <img src={user?.picture} alt={user?.name} />
          </IonAvatar>
        </div>

        {/* User Information */}
        {/* <div className="user-name">Johnny Appleseed</div> */}
        {/* <div className="user-at">@johnnyp</div> */}

        <div className="user-name">{user?.name}</div>
        <div className="user-at">{user?.nickname}</div>

        <div className="user-at">
          <small>Member since {userSince}</small>
          <small>Member since {user?.created_at}</small>
        </div>

        {/* User Organizations*/}
        <div className="list-title">Your Organizations</div>
        <IonList inset={true}>
          <IonItem>
            <IonLabel>Johnny's Organization</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>PPUX Team Planning</IonLabel>
          </IonItem>
        </IonList>

        {/* User Actions */}
        <div className="list-title">Actions</div>
        <IonList inset={true}>
          <IonItem>
            <IonLabel>Change Password</IonLabel>
          </IonItem>
          <LogoutButton />
          {/* <IonItem> */}
          {/* <IonLabel>Delete Account</IonLabel> */}
          <DeleteButton />
          {/* </IonItem> */}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
