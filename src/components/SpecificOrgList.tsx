import React from "react";
import { useHistory } from "react-router";
import { IonList, IonItem, IonLabel } from "@ionic/react";

interface BoardProps {
    boardId?: string
    text?: string | null; // board's title
    listImg?: string; //board image src
}

interface CustomListProps {
    title?: string; //organization title (ignore how its being used in home rn)
    orgId?: string;
    subTitle?: string; //subtitle, if required (for ex. "today", "yesterday" on home page)
    items?: BoardProps[]; //list of board items
    titleImg?: string; //organization image src
    link?: string;
}

const SpecificOrgList: React.FC<CustomListProps> = ({
    title,
    orgId,
    subTitle,
    items,
    titleImg,
    link,
}) => {
    const history = useHistory();

    return (
        <div>
            {/* display title/image/subtitle if they exist */}
            {title && (
                <div className="list-title">
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
                        <IonItem key={index} routerLink={`/app/organizations/${orgId}/boards/${item.boardId}`}>
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

export default SpecificOrgList;