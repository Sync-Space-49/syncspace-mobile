import { IonContent, IonHeader, IonPage, IonTitle, IonButton, IonToolbar, IonText, IonImg, IonIcon, IonGrid, IonCol, IonRow } from '@ionic/react';
import SyncSpaceLogo from '/svgs/SyncSpace-logo.svg';
import SyncSpaceLogoSmall from '/svgs/SyncSpace-logo-100w.svg';
import './LandingPage.css';
import TabBar from '../components/TabBar';



const LandingPage: React.FC = () => {
  return (
    <IonPage>
      {/* <TabBar /> */}
      <IonContent className="ion-padding" scroll-y="false">
        <IonGrid>
          <IonRow>
            <IonCol className='ion-text-center'>
              <IonIcon icon={SyncSpaceLogoSmall} /> 
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='ion-text-center'>
                <h1>Welcome back!</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className='ion-text-center'>
              <IonButton routerLink="/app" routerDirection='root'>
                Ready to Launch?
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  ); 
};

export default LandingPage;