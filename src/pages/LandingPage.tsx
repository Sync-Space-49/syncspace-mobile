import { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, IonIcon, IonGrid, IonCol, IonRow, IonButtons, IonImg } from '@ionic/react';
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
    <IonPage>
      <IonContent className="ion-padding" scroll-y="false">
        <div className='background-img'>
        <IonImg src="https://s3.us-east-1.wasabisys.com/sync-space/rocket-tail.png" />
        </div>
        <IonGrid>
          <IonRow>
            <IonCol className='ion-text-center ion-padding'>
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
              <div className='landing-page-button'>
                <LoginButton /> 
                </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ); 
};

export default LandingPage;