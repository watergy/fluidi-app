import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Gun from "gun";
import { useState } from "react";
import Session from "../services/Session";
import State from "../services/State";
import "./Auth.css";

const Auth = () => {
  const [alias, setAlias] = useState("");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>welcome to fluidi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="auth-content">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Gun.SEA.pair((ack) => {
              Session.login(ack);
              State.public.user().get("profile").get("name").put(alias);
              Session.createChatLink();
            });
          }}
        >
          <IonLabel>What is your name?</IonLabel>
          <IonInput
            value={alias}
            placeholder="a name..."
            onIonChange={(e) => setAlias(e.detail!.value!)}
          />
          <IonButton expand="full" type="submit">
            Sign in
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
