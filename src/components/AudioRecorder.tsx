import * as ReactDOM from "react-dom";
import * as React from "react";
import { useEffect, useState } from "react";
import { useVoiceRecorder } from "use-voice-recorder";

const AudioRecorder: React.FC = () => {
  const [records, updateRecords] = useState<any[]>([]);
  const { isRecording, stop, start } = useVoiceRecorder((data) => {
    updateRecords([...records, window.URL.createObjectURL(data)]);
  });

  return (
    <div className={"container"}>
      <div className={"hint"}>Just hold the mic button and speak.</div>
      <div className={"records"}>
        <h1>Records:</h1>
        {records.map((data, idx) => (
          <div key={idx}>
            <audio src={data} controls preload={"metadata"} />
          </div>
        ))}
      </div>
      <div>
        <button
          className={`btn ${isRecording ? "active" : ""}`}
          onMouseDown={start}
          onMouseUp={stop}
          onTouchStart={start}
          onTouchEnd={stop}
        >
          🎙
        </button>

        <h3 className={"onair"}>On air: {isRecording ? "on" : "off"}</h3>
      </div>
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
