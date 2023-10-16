import { IonContent, IonHeader, IonPage, IonTitle, IonButton, IonToolbar, IonText, IonImg, IonIcon, IonGrid, IonCol, IonRow } from '@ionic/react';
import SyncSpaceLogo from '/svgs/SyncSpace-logo.svg'
import SyncSpaceLogoSmall from '/svgs/SyncSpace-logo-100w.svg'

import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
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
              <IonButton href="/login">Ready to Launch?</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ); 
};

export default LandingPage;