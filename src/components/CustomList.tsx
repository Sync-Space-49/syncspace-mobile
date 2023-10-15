import React from "react";
import { IonList, IonItem, IonLabel } from "@ionic/react";

interface CustomListProps {
  title?: string; //list's title
  subTitle?: string; //subtitle, if required (for ex. "today", "yesterday" on home page)
  items: string[]; //list of items we're trying to show
  imgSrc?: string; //if adding image
}

// destructuring
const CustomList: React.FC<CustomListProps> = ({
  title,
  subTitle,
  items,
  imgSrc,
}) => {
  return (
    <div>
      {/* display title/image/subtitle if they exist */}
      {title && (
        <div className="list-title">
          {imgSrc && <img src={imgSrc} alt="list icon" className="list-icon" />}
          {title}
        </div>
      )}
      {subTitle && <div className="sub-list-title">{subTitle}</div>}
      {/* display each item in items array as IonItem*/}
      <IonList inset={true}>
        {items.map((item) => (
          <IonItem>
            <IonLabel>{item}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

export default CustomList;
