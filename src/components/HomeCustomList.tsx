import React from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { IonList, IonItem, IonLabel } from "@ionic/react";

interface BoardProps {
  boardId?: string;
  text?: string | null; // board's title
  listImg?: string; //board image src
  orgId?: string;
}

interface CustomListProps {
  // extends RouteComponentProps<{ }>
  title?: string; //organization title (ignore how its being used in home rn)
  orgId?: string;
  subTitle?: string; //subtitle, if required (for ex. "today", "yesterday" on home page)
  items?: BoardProps[]; //list of board items
  titleImg?: string; //organization image src
}

const HomeCustomList: React.FC<CustomListProps> = ({
  title,
  orgId,
  subTitle,
  items,
  titleImg,
  // match
}) => {
  const history = useHistory();

  const navigateToOrganization = () => {
    history.push(`/app/myorgs/organizations/${orgId}`);
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
            <IonItem
              key={index}
              routerLink={`/app/myorgs/organizations/${item.orgId}/boards/${item.boardId}`}
            >
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

export default HomeCustomList;
