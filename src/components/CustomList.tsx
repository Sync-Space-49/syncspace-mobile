import React from "react";
import { useHistory } from "react-router";
import { IonList, IonItem, IonLabel } from "@ionic/react";

interface BoardProps {
  text?: string | null; // board's title
  listImg?: string; //board image src
}

interface CustomListProps {
  title?: string; //organization title (ignore how its being used in home rn)
  subTitle?: string; //subtitle, if required (for ex. "today", "yesterday" on home page)
  items?: BoardProps[]; //list of board items
  titleImg?: string; //organization image src
}

const CustomList: React.FC<CustomListProps> = ({
  title,
  subTitle,
  items,
  titleImg,
}) => {
  const history = useHistory();
  const navigateToOrganization = () => {
    const orgId = '189db961-a7f0-4746-ae09-de6e3ee9232b';
    history.push(`/app/organizations/${orgId}`);
  };

  return (
    <div>
      {/* display title/image/subtitle if they exist */}
      {title && (
        <div className="list-title" onClick={navigateToOrganization}>
          {titleImg && (
            <img src={titleImg} alt="list title icon" className="list-icon" />
          )}
          {title}
        </div>
      )}
      {subTitle && <div className="sub-list-title">{subTitle}</div>}
      {/* display each item in items array as IonItem*/}
      {items && items.length > 0 && (
        <IonList inset={true}>
          {items.map((item, index) => (
            <IonItem key={index} routerLink="/app/board">
              {item.listImg && (
                <img
                  src={item.listImg}
                  alt="list item icon"
                  className="item-icon"
                />
              )}
              <IonLabel>{item.text}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};

export default CustomList;
