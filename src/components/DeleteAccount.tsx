import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { IonAlert, IonButton, IonItem } from "@ionic/react";
import { serverAdress } from "../auth.config";
import axios from "axios";
// This should reflect the URL added earlier to your "Allowed Logout URLs" setting
// in the Auth0 dashboard.

const logoutUri = window.location.origin; //hopefully links to landingpage

const DeleteButton: React.FC = () => {
  const { logout, user, getAccessTokenSilently } = useAuth0();

  const doLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: logoutUri,
      },
      async openUrl(url) {
        // Redirect using Capacitor's Browser plugin
        await Browser.open({
          url,
          windowName: "_self",
        });
      },
    });
  };

  const deleteAccount = async (userId: string, token: string) => {
    const options = {
      method: "DELETE",
      url: `${serverAdress}/api/users/${userId}`,
      headers: { authorization: `Bearer ${token}` },
    }

    await axios(options)
      .then((response) => {
        console.log('account deleted, sorry to see you go' + response.data)
      })
      .catch((error) => {
        console.error(error.message)
      })

  }

  return (
    <>
      <IonAlert
        trigger="present-alert"
        header="Are you sure you want to delete your account?"
        buttons={[
          {
            text: "No",
            role: 'cancel',
            cssClass: "primary",
          },
          {
            text: "Yes",
            cssClass: "danger",
            role: 'confirm',
            handler: async () => {
              console.log('alert confirmed: ')
              let token = await getAccessTokenSilently();
              let userId = user!.sub;
              await deleteAccount(userId!, token);
              doLogout();
            }
          },
        ]}
        onDidDismiss={({ detail }) => console.log(`dismissed with role: ${detail.role}`)}
      ></IonAlert>
      <IonButton fill="clear" id="present-alert">
        <IonItem color="danger">Delete Account</IonItem>
      </IonButton>
    </>
  );
};

export default DeleteButton;
