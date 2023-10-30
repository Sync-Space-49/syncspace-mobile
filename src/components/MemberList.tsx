import { useAuth0 } from "@auth0/auth0-react";
import { IonItemSliding, IonItem, IonAvatar, IonImg, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonNote } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

interface MemberListProps {
    users?: [] // should have all the users that are gonna appear
}

const MemberList: React.FC<MemberListProps> = ({
    users
}) => {

    const { user } = useAuth0();

    return (
        <IonItemSliding>
            <IonItem>
                <IonAvatar aria-hidden="true" slot="start">
                    <IonImg src={user?.picture} />
                </IonAvatar>
                <IonLabel>{user?.name}</IonLabel>
                <IonNote slot="end">Member</IonNote>
            </IonItem>
            <IonItemOptions slot="end">
                <IonItemOption color="danger">
                    <IonIcon slot="icon-only" icon={closeOutline} />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
}

export default MemberList;