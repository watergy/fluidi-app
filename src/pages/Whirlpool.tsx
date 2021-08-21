import { useEffect, useState, useReducer } from "react";
import {
  IonButton,
  IonCard,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
} from "@ionic/react";
import TorrentMachine from "../services/WebTorrent";

const Whirlpool = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const startStreaming = () => {};

  return (
    <IonPage>
      <IonTitle>Whirlpool</IonTitle>
      <video src={videoSrc} controls />
      <IonButton onClick={startStreaming}>Start streaming</IonButton>
    </IonPage>
  );
};

export default Whirlpool;

// // @ts-ignore
// var AudioContext = window.AudioContext || window.webkitAudioContext || false;

// interface State {
//   recordedChunks: any[];
// }

// const initialState: State = {
//   recordedChunks: [],
// };

// const reducer = (state: State, chunk: any) => {
//   return {
//     recordedChunks: [...state.recordedChunks, chunk],
//   };
// };

// let recorder: MediaRecorder;

// let audioCtx = new AudioContext();
// const [audioSrc, setAudioSrc] = useState("");
// const [state, dispatch] = useReducer(reducer, initialState);

// const handleMedia = (stream: MediaStream) => {
//   // convert the stream to a blob
//   let source = audioCtx.createMediaStreamSource(stream);
//   console.log("destination", audioCtx.destination);
//   try {
//     recorder = new MediaRecorder(stream);
//   } catch (err) {
//     console.error(err);
//     alert(err);
//     return;
//   }

//   recorder.ondataavailable = (event) => {
//     console.log(" Recorded chunk of size " + event.data.size + "B");
//     alert(event);
//     dispatch(event.data);
//   };

//   recorder.start(100);
// };

// const startStreaming = () => {
//   navigator.mediaDevices
//     .getUserMedia({ video: false, audio: true })
//     .then(handleMedia)
//     .catch((err) => {
//       console.error(err);
//       alert(err);
//     });
// };

// const stopStreaming = () => {
//   console.log(recorder.state);
//   recorder.stop();
//   console.log(recorder.state);
// };
