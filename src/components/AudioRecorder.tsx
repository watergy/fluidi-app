// @ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { useVoiceRecorder } from "use-voice-recorder";
import { IonButton, IonIcon } from "@ionic/react";
import { recording, micOutline, micOffOutline } from "ionicons/icons";
import WebTorrent from "webtorrent";

/*
    We will use WebTorrent for saving/retrieving our audio files.
    TODO: abstract this away to it's own service

    Webtorrent requires (among other options) a Buffer object. 
    When we stop recording, we will turn the audio blob into a 
    Buffer and save that in state. 
    TODO: clean this up. We shouldn't have to store the data in state twice.

    We will then, when the START SEEDING button is clicked, create a new 
    torrent from this Buffer and start seeding it.
    TODO: definitely need to move parts of this elsewhere so that the torrent 
    is seeded even if the user is on a different page. Unless webtorrent handles that
    automatically? Will need to test and find out.
*/

const AudioRecorder: React.FC = () => {
  const [record, setRecord] = useState<string>("");
  const [audioBuffer, setAudioBuffer] = useState<Buffer>();
  const [leechingTorrent, setLeechingTorrent] = useState<string>();
  const [dspeed, setDspeed] = useState(0);
  const { isRecording, stop, start } = useVoiceRecorder(async (data) => {
    // convert the data into a buffer and save it to state.
    const buffer = Buffer.from(new ArrayBuffer(data));
    setAudioBuffer(buffer);
    setRecord(window.URL.createObjectURL(data));
  });

  const client = new WebTorrent();

  useEffect(() => {
    console.log("SPEED CHANGED!");
    setDspeed(client.downloadSpeed);
  }, [client.downloadSpeed]);

  const startSeeding = () => {
    if (!audioBuffer) return;
    // client.seed("", {}, (torrent) => {});
    client.seed(audioBuffer, {}, (torrent) => {
      console.log("torrent is created and seeding!", torrent);
      console.log("magnet link\n", torrent.magnetURI);
      alert(torrent.magnetURI);
    });
  };

  const startLeeching = (magnetLink: string) => {
    client.add(magnetLink, {}, (torrent) => {
      console.log("started leeching", torrent);
      setLeechingTorrent(torrent.files[0].getBlobURL);
    });
  };

  return (
    <div className={"container"}>
      <h1>{dspeed}</h1>
      <audio id="audio_element" src={record} controls preload={"metadata"} />

      <IonButton
        color={isRecording ? "danger" : "secondary"}
        onClick={isRecording ? stop : start}
      >
        <IonIcon icon={isRecording ? micOutline : micOffOutline} />
        {isRecording ? "red means recording" : "not recording"}
      </IonButton>
      <IonButton onClick={startSeeding}>
        Start seeding your audio file
      </IonButton>
      <div>
        <audio src={leechingTorrent} controls />
        <h1>ELLO</h1>
        <IonButton
          onClick={() => {
            startLeeching(prompt("enter link") as string);
          }}
        >
          start leeching
        </IonButton>
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
