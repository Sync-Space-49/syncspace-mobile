import { useAuth0 } from '@auth0/auth0-react';
import { Browser } from '@capacitor/browser';
import { IonButton, IonItem, IonToast } from '@ionic/react';

// This should reflect the URL added earlier to your "Allowed Logout URLs" setting
// in the Auth0 dashboard.

const logoutUri = 'http://localhost:8100'; //hopefully links to landingpage

const DeleteButton: React.FC = () => {
  const { logout } = useAuth0();

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
        <IonButton fill="clear" id="present-alert" >
            <IonItem onClick={doLogout} color="danger">Delete Account</IonItem>
        </IonButton>
    </>
  );
};

export default DeleteButton;