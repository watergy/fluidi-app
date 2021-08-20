import { useState } from "react";
import {
  IonCard,
  IonButton,
  IonInput,
  IonLabel,
  IonTextarea,
} from "@ionic/react";

import "react-voice-recorder/dist/index.css";
import State from "../services/State";
import VoiceRecorder from "./AudioRecorder";

const ComposeDroplet = () => {
  // TODO: make a reducer for the form? maybe..
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errorText, setErrorText] = useState("");
  const [base64, setBase64] = useState<string>();

  return (
    <IonCard>
      <VoiceRecorder setBase64={setBase64} />
      <IonLabel className="title-label">Title</IonLabel>
      <IonInput
        className="title-input"
        value={title}
        placeholder="so i was taking a walk..."
        onIonChange={(e) => setTitle(e.detail!.value!)}
      />

      <IonButton
        onClick={(e) => {
          e.preventDefault();
          console.log(tags);
          State.public.get("fluiditestexp").get("droplets").set({
            //@ts-ignore
            title,
            //@ts-ignore
            author: "me",
            //@ts-ignore
            createdAt: Date.now(),
            //@ts-ignore
            base64,
          });
        }}
      >
        Click here to submit your droplet
      </IonButton>
      <IonTextarea value={errorText} />
    </IonCard>
  );
};

export default ComposeDroplet;
