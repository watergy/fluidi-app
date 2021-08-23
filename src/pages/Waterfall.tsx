import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import { useEffect, useReducer, useRef, useState } from "react";
import Peer from "peerjs";
import State from "../services/State";

type State = {
  streamers: string[];
};

const initialState: State = {
  streamers: [],
};

const reducer = (state: State, streamer: any) => {
  return {
    streamers: [...state.streamers, streamer],
  };
};

const Waterfall = () => {
  const [amIStreaming, setAmIStreaming] = useState(false);
  const [errorText, setErrorText] = useState("no error :)");
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const createEmptyAudioTrack = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    // @ts-ignore
    const track = dst.stream.getAudioTracks()[0];
    return Object.assign(track, { enabled: false });
  };

  const createEmptyVideoTrack = ({ width, height }: any) => {
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    // @ts-ignore
    canvas.getContext("2d").fillRect(0, 0, width, height);

    // @ts-ignore
    const stream = canvas.captureStream();
    const track = stream.getVideoTracks()[0];

    return Object.assign(track, { enabled: false });
  };

  const startStreaming = async () => {
    const stream = await getVideoStream();
    const peer = new Peer();
    peer.on("open", () => {
      alert("click");
      peer.call("poopyhead22", stream!);
    });
  };

  const startListening = async () => {
    const audioTrack = createEmptyAudioTrack();
    const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
    const mediaStream = new MediaStream([audioTrack, videoTrack]);
    const peer = new Peer("poopyhead22");
    console.log(peer);

    peer.on("call", (call) => {
      console.log(call);
      call.answer();
      call.on("stream", (stream) => {
        console.log(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      });
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>Waterfall</IonTitle>
      </IonHeader>
      <IonContent>
        <video ref={myVideoRef} controls />
        <IonButton onClick={startStreaming}>Start streaming</IonButton>
        <IonList>
          <IonItem>
            <IonInput />
            <IonButton onClick={startListening}>Start listening</IonButton>
          </IonItem>
        </IonList>
        <IonText>{errorText.toString()}</IonText>
      </IonContent>
    </IonPage>
  );

  async function getVideoStream() {
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (myVideoRef.current !== null) {
        myVideoRef.current!.srcObject = stream;
      }
      return stream;
    } catch (err) {
      alert(err);
      console.error(err);
      setErrorText(err);
    }
  }
};

export default Waterfall;