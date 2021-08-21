import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import { useEffect, useReducer, useRef, useState } from "react";
import State from "../services/State";
import "gun/lib/unset";
type State = {
  streamers: string[];
};

const initialState: State = {
  streamers: [],
};

const reducer = (state: State, streamer: string) => {
  return {
    streamers: [...state.streamers, streamer],
  };
};

const Waterfall = () => {
  const [myVideoSrc, setMyVideoSrc] = useState("");
  const [streamingVideoSrc, setStreamingVideoSrc] = useState("");
  const [amIStreaming, setAmIStreaming] = useState(false);
  const [currentStreamers, setCurrentStreamers] = useState([]);
  const [errorText, setErrorText] = useState("no error :)");
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const startStreaming = async () => {
    const stream = await getVideoStream();
    State.public.get("streaming").set("chance", (ack) => {
      console.log(ack);
    });
    // start listening for incoming calls
  };

  const startListening = async (streamer: string) => {};

  // listen for streamers so we can update the UI
  useEffect(() => {
    State.public
      .get("streaming")
      .map()
      .on((streamer) => {
        console.log("new streamer: ", streamer);
        dispatch(streamer as string);
      });

    return () => {
      // @ts-ignore
      State.public.get("streaming").unset("chance");
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>Waterfall</IonTitle>
      </IonHeader>
      <IonContent>
        <video ref={myVideoRef} controls />
        {amIStreaming && <video ref={myVideoRef} controls />}
        <IonButton onClick={startStreaming}>Start streaming</IonButton>
        <IonList>
          {state.streamers.map((streamer) => {
            return (
              <IonItem onClick={() => startListening(streamer)}>
                {streamer}
              </IonItem>
            );
          })}
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
      console.log("stream: ", stream);
      //   setMyVideoSrc(stream);
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
// /*
//     we need to:
//         use mediarecorder to collect webcam stream
//         display it on the client (this is kind of optional)
//         begin accepting calls for webrtc

//     */
// // start collecting webcam stream
// const startRecording = async () => {

// }
// // display video stream
// // begin listening to and accepting webrtc connections
