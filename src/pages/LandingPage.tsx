import { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonModal } from '@ionic/react';
// import { App as CapApp } from '@capacitor/app';
// import { Browser } from '@capacitor/browser';
// import { useAuth0 } from '@auth0/auth0-react';

import SyncSpaceLogoSmall from '/svgs/SyncSpace-logo-100w.svg'
import './LandingPage.css';
import LoginButton from '../components/Login';

const LandingPage: React.FC = () => {

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);
  
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    setPresentingElement(page.current);
  }, []);
  
  return (
    // <IonPage ref={page}>
    <IonPage>
      <IonContent className="ion-padding" scroll-y="false">
        <IonGrid>
          <IonRow>
            <IonCol className='ion-text-center'>
              <IonIcon icon={SyncSpaceLogoSmall} /> 
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='ion-text-center'>
                <h1>Welcome to SyncSpace!</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='ion-text-center'>
              {/* <IonButton id="open-modal" expand="block"> 
                Ready to Launch?
              </IonButton> */}
              <LoginButton />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ); 
};

export default LandingPage;