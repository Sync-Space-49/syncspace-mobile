import { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonModal } from '@ionic/react';
import LoginButton from '../components/Login';

import './LandingPage.css';

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
              <IonIcon icon="https://s3.us-east-1.wasabisys.com/sync-space/logo/SyncSpace-logo-100w.svg" /> 
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='ion-text-center'>
                <h1>Welcome to SyncSpace!</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='ion-text-center'>
              <LoginButton />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ); 
};

export default LandingPage;