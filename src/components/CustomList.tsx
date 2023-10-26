import React from "react";
import { useHistory } from "react-router";
import { IonList, IonItem, IonLabel } from "@ionic/react";

interface ListProps {
  text: string; // the list's content
  listImg?: string; //list image src
}

interface CustomListProps {
  title?: string; //list's title
  subTitle?: string; //subtitle, if required (for ex. "today", "yesterday" on home page)
  items: ListProps[]; //list of items we're trying to show
  titleImg?: string; //title image src
}
// **TODO: users on Home page should not be taken to /app/organizations, when user is in my organization and clicks title should not be taken
// destructuring
const CustomList: React.FC<CustomListProps> = ({
  title,
  subTitle,
  items,
  titleImg,
}) => {
  const history = useHistory();
  const navigateToOrganization = () => {
    console.log("Navigating to /app/organization");
    history.push("/app/organization");
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
    </div>
  );
};

export default CustomList;
