// https://developers.google.com/web/fundamentals/media/recording-audio

import { useEffect, useState } from "react";
import {
  IonCard,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  IonTextarea,
  IonRouterLink,
} from "@ionic/react";
import {
  mic,
  micOff,
  micOffOutline,
  micOutline,
  pauseOutline,
  play,
} from "ionicons/icons";
//  @ts-ignore
import AudioSpectrum from "react-audio-spectrum";
// @ts-ignore
// import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { Recorder } from "react-voice-recorder";
import WebTorrent from "webtorrent";
import "react-voice-recorder/dist/index.css";
import State from "../services/State";
import VoiceRecorder from "./AudioRecorder";

const ComposeDroplet = () => {
  // TODO: make a reducer for the form? maybe..
  const [recording, setRecording] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags]: any = useState([]);
  const [tagText, setTagText] = useState("");
  const [audioFile, setAudioFile]: any = useState(null);
  const [errorText, setErrorText] = useState("");
  const [audioSrc, setAudioSrc]: any = useState("");
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [audioBuffer, setAudioBuffer] = useState<Buffer>();
  const [base64, setBase64] = useState<string>();
  const client = new WebTorrent();

  useEffect(() => {
    console.log(audioBuffer);
  }, [audioBuffer]);

  return (
    <IonCard>
      <VoiceRecorder setBase64={setBase64} />
      <br />
      <IonLabel>Title</IonLabel>
      <IonInput
        value={title}
        placeholder="so i was taking a walk..."
        onIonChange={(e) => setTitle(e.detail!.value!)}
      />
      <IonLabel>space-seperated tags</IonLabel>
      <IonList>
        {tags.map((tag: string) => {
          return <IonItem>{tag}</IonItem>;
        })}
      </IonList>
      <IonInput
        placeholder="fun quirky scary"
        value={tagText}
        onIonChange={(e) => {
          // get the last character
          const lastEnteredChar =
            e.detail!.value![e.detail.value?.length! - 1 || 0];
          console.log(lastEnteredChar);
          // if space, add the word to the tags
          if (lastEnteredChar == " ") {
            // add the input to the tags state
            setTags([...tags, e.detail!.value!]);
            setTagText("");
          } else {
            setTagText(e.detail!.value!);
          }
        }}
      />
      <IonButton
        onClick={(e) => {
          e.preventDefault();
          // client.seed(audioBuffer!, {}, (torrent) => {
          // console.log("torrent is created and seeding!", torrent);
          // console.log("magnet link\n", torrent.magnetURI);
          // @ts-ignore
          State.public.get("fluiditestexp").get("droplets").set({
            //@ts-ignore
            title,
            //@ts-ignore
            tags,
            //@ts-ignore
            author: "me",
            //@ts-ignore
            createdAt: Date.now(),
            //@ts-ignore
            base64,
          });
          console.log("did it get here?");
          // });
        }}
      >
        Click here to submit your droplet
      </IonButton>
      <IonTextarea value={errorText} />
    </IonCard>
  );
};

export default ComposeDroplet;
