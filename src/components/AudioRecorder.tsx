import * as ReactDOM from "react-dom";
import * as React from "react";
import { useEffect, useState } from "react";
import { useVoiceRecorder } from "use-voice-recorder";
import { IonButton, IonIcon } from "@ionic/react";
import { recording, micOutline, micOffOutline } from "ionicons/icons";

const AudioRecorder: React.FC = () => {
  const [record, setRecord] = useState<string>("");
  const { isRecording, stop, start } = useVoiceRecorder((data) => {
    setRecord(window.URL.createObjectURL(data));
  });

  return (
    <div className={"container"}>
      <canvas id="canvas" width="500" height="500"></canvas>
      <audio id="audio_element" src={record} controls preload={"metadata"} />

      <IonButton
        color={isRecording ? "danger" : "secondary"}
        onClick={isRecording ? stop : start}
      >
        <IonIcon icon={isRecording ? micOutline : micOffOutline} />
        {isRecording ? "red means recording" : "not recording"}
      </IonButton>
    </div>
  );
};

export default AudioRecorder;

// import { IonButton, IonCard } from "@ionic/react";
// import { useEffect, useState } from "react";

// const AudioRecorder = () => {
//   const [audioSrc, setAudioSrc] = useState("");

//   return (

//     // NOTE: the below works to upload a file
//     // <IonCard>
//     //   <input
//     //     type="file"
//     //     accept="audio"
//     //     capture
//     //     onChange={(e) => {
//     //       const file = e.target.files![0];
//     //       console.log(file);
//     //       setAudioSrc(URL.createObjectURL(file));
//     //       console.log(URL.createObjectURL(file));
//     //     }}
//     //   />
//     //   <audio controls src={audioSrc}>
//     //     <source src={audioSrc} type="audio/mp3" />
//     //   </audio>
//     // </IonCard>
//   );
// };

// export default AudioRecorder;
