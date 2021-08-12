import { IonPage } from "@ionic/react";
import { useEffect } from "react";
import gun from "../gun";

const ChatRoom = () => {
  useEffect(() => {
    gun.get("");
  }, []);
  return (
    <IonPage>
      <h1>Hello</h1>
    </IonPage>
  );
};

export default ChatRoom;
