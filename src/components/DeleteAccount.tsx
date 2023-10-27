import { useAuth0 } from '@auth0/auth0-react';
import { Browser } from '@capacitor/browser';
import { IonAlert, IonButton, IonItem, IonToast } from '@ionic/react';
import { useState } from 'react';
// This should reflect the URL added earlier to your "Allowed Logout URLs" setting
// in the Auth0 dashboard.

const logoutUri = 'http://localhost:8100'; //hopefully links to landingpage


const DeleteButton: React.FC = () => {
    const { logout } = useAuth0();
    const [disableButton, setDisableButton] = useState("false");
    
  const doLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: logoutUri,
      },
      async openUrl(url) {
         // Redirect using Capacitor's Browser plugin
        await Browser.open({
          url,
          windowName: "_self"
        });
      }
    });
  };

  // return <IonButton onClick={doLogout}>Log out</IonButton>;
  return (
    <>
    <IonAlert
            trigger="present-alert"
            header="Are you sure you want to delete your account?"
            buttons={[
              {
                text: 'No',
                cssClass: 'primary'
              },
              {
                text: 'Yes',
                cssClass: 'danger'
              }
            ]}
            onDidDismiss={doLogout}
            >
        </IonAlert>
        <IonButton fill="clear" id="present-alert" >
            <IonItem color="danger">Delete Account</IonItem>
        </IonButton>
    </>
  );
};

export default DeleteButton;