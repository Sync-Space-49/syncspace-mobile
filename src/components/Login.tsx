import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { IonButton } from "@ionic/react";

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/app',
      },
      openUrl(url) {
        // Redirect using Capacitor's Browser plugin
        Browser.open({
          url,
          windowName: "_self",
        });
      },
    });
  };

  return <IonButton onClick={login}>Ready to Launch?</IonButton>;
};

export default LoginButton;
