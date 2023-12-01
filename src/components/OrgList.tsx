
import { useAuth0 } from "@auth0/auth0-react";
import {
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonList,
  IonAlert,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { serverAdress } from "../auth.config";
import axios from "axios";
import { useState } from "react";

interface org {
  text: string
  id: string,
  listImg?: string
}

interface OrgProps {
  orgs: org[]
  updateOrgList: () => void;
}

const OrgList: React.FC<OrgProps> = ({ orgs, updateOrgList }) => {

  const { getAccessTokenSilently } = useAuth0();

  const [showAlert, setShowAlert] = useState(false);
  const [orgIdToDelete, setOrgIdToDelete] = useState<string | null>(null);

  const deleteOrg = async (orgId: string) => {
    let token = await getAccessTokenSilently();
    const options = {
      method: "DELETE",
      url: `${serverAdress}api/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
    }

    await axios(options)
      .then((response) => {
        console.log('org deleted' + response.data)
        updateOrgList();
      })
      .catch((error) => {
        console.error(error.message);
      })
  }


  const handleOnClick = (orgId: string) => {
    setShowAlert(true)
    setOrgIdToDelete(orgId);
  }


  return (
    <>
      {orgs && orgs.length > 0 && (
        <IonList inset={true}>
          {orgs.map((org, index) => (
            <IonItemSliding key={index}>
              <IonItem routerLink={`/app/profile/organizations/${org.id}`}>
                {org.listImg && (
                  <img
                    src={org.listImg}
                    alt="list item icon"
                    className="item-icon"
                  />
                )}
                <IonLabel>{org?.text}</IonLabel>
              </IonItem>
              <IonItemOptions slot="end">
                <IonItemOption color="danger" id="present-alert" onClick={() => handleOnClick(org.id)}>
                  <IonIcon slot="icon-only" icon={closeOutline} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      )}
      <IonAlert
        isOpen={showAlert}
        trigger="present-alert"
        header="Are you sure you want to delete this org?"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Delete",
            role: 'confirm',
          },
        ]}
        onIonAlertDidDismiss={({ detail }) => {
          if (detail.role === 'confirm') {
            deleteOrg(orgIdToDelete!);
          }
          setShowAlert(false);
        }}
      />
    </>
  )
};

export default OrgList;
