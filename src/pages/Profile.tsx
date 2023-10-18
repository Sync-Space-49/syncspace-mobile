import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Profile.css";

const Profile: React.FC = () => {
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

        {/* User Profile Pic */}
        <div className="profile-image-container">
          <img
            src="/icons/SyncSpace-mint.png"
            alt="user pfp"
            className="profile-image"
          />
        </div>

        {/* User Information */}
        <div className="user-name">Johnny Appleseed</div>
        <div className="user-at">@johnnyp</div>
        <div className="user-at">
          <small>Member since January 2023</small>
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
          <IonItem>
            <IonLabel>Log Out</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Delete Account</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
