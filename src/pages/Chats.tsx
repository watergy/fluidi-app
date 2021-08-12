import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ChatItem from "components/ChatItem";
import gun from "gun";
import "gun/sea";
import { useEffect, useState } from "react";

const Chats = () => {
  const [chats, setChats] = useState([
    {
      name: "Alice",
      id: "12389jsjf98awj4f",
    },
    {
      name: "Bob",
      id: "4fcvazFGZ",
    },
  ]);

  useEffect(() => {
    const user = gun.user().recall({ sessionStorage: true });
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fluidi Messenger</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="small">Fluidi Messenger</IonTitle>
            <IonButtons>
              <IonButton onClick={() => {}}>invite link</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        {chats.map((chat) => {
          return <ChatItem chat={chat} />;
        })}
      </IonContent>
    </IonPage>
  );
};

export default Chats;
