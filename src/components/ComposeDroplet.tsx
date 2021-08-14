import { useState } from "react";
import {
  IonCard,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  IonTextarea,
} from "@ionic/react";
import { mic, micOff, micOutline, pauseOutline, play } from "ionicons/icons";
// @ts-ignore
import AudioSpectrum from "react-audio-spectrum";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

const ComposeDroplet = () => {
  // TODO: make a reducer for the form? maybe..
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBloblUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags]: any = useState([]);
  const [tagText, setTagText] = useState("");
  const [audioFile, setAudioFile]: any = useState(null);
  const [errorText, setErrorText] = useState("");
  const [recordState, setRecordState] = useState(null);

  const startRecording = (): void => {
    setRecordState(RecordState.START);
    // recorder
    //   .start()
    //   .then(() => {
    //     setRecording(true);
    //   })
    //   .catch(console.error);
  };

  const stopRecording = (): void => {
    setRecordState(RecordState.STOP);
    // recorder
    //   .stop()
    //   .getMp3()
    //   .then(([buffer, blob]: any) => {
    //     const file = new File(buffer, "me-at-thevoice.mp3", {
    //       type: blob.type,
    //       lastModified: Date.now(),
    //     });
    //     // now that we have the file, save it in state while the user finishes composing
    //     //   setAudioFile(file);
    //     setRecording(false);
    //   })
    //   .catch((err: string) => {
    //     console.error(err);
    //     setErrorText(err);
    //   });
  };

  return (
    <IonCard>
      <IonButton
        color={recording ? "warning" : "secondary"}
        onClick={recording ? stopRecording : startRecording}
      >
        <IonIcon icon={micOutline} />
        {recording ? "red means recording" : "not recording"}
      </IonButton>
      {recording ? (
        <IonIcon icon={mic} size="large" />
      ) : (
        <IonIcon icon={micOff} size="large" />
      )}
      <br />
      {audioFile && (
        <AudioSpectrum
          height={200}
          width={300}
          audioElement={new Audio(audioFile)}
        />
      )}
      <br />
      <AudioReactRecorder state={recordState} onStop={stopRecording} />
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
      <IonTextarea value={errorText} />
    </IonCard>
  );
};

export default ComposeDroplet;
