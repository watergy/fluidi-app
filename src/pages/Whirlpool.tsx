import { useEffect, useState, useReducer } from "react";
import {
  IonButton,
  IonCard,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
} from "@ionic/react";

interface State {
  recordedChunks: any[];
}

const initialState: State = {
  recordedChunks: [],
};

const reducer = (state: State, chunk: any) => {
  return {
    recordedChunks: [...state.recordedChunks, chunk],
  };
};
let recorder: MediaRecorder;
const Whirlpool = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleMedia = (stream: MediaStream) => {
    // convert the stream to a blob
    console.log(stream);
    const superBuffer = new Blob(state.recordedChunks);
    setVideoSrc(window.URL.createObjectURL(superBuffer));

    try {
      recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    } catch (err) {
      console.error(err);
      alert(err);
      return;
    }

    recorder.ondataavailable = (event) => {
      console.log(" Recorded chunk of size " + event.data.size + "B");
      dispatch(event.data);
    };

    recorder.start(100);
  };

  const startStreaming = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(handleMedia)
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  };

  const stopStreaming = () => {
    recorder.stop();
  };

  return (
    <IonPage>
      <IonTitle>Whirlpool</IonTitle>
      <video src={videoSrc} controls />
      <IonButton onClick={startStreaming}>Start streaming</IonButton>
      <IonButton onClick={stopStreaming}>Stop streaming</IonButton>
    </IonPage>
  );
};

export default Whirlpool;
