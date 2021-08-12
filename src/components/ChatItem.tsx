import { IonItem, IonText } from "@ionic/react";
import { Chat } from "../types";

interface Props {
  chat: Chat;
}

const ChatItem = ({ chat }: Props) => {
  return (
    <IonItem routerLink={`/chat/${chat.id}`} key={chat.id}>
      <IonText>{chat.name}</IonText>
    </IonItem>
  );
};

export default ChatItem;
