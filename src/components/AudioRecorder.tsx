import * as React from "react";
import { useEffect, useState } from "react";
import { useVoiceRecorder } from "use-voice-recorder";
import { IonButton, IonIcon } from "@ionic/react";
import { recording, micOutline, micOffOutline } from "ionicons/icons";
import WebTorrent from "webtorrent";
import State from "../services/State";

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

interface AudioRecorderProps {
  setMagnetLink: (magnetLink: string) => void;
}

const AudioRecorder = ({ setMagnetLink }: AudioRecorderProps) => {
  const [record, setRecord] = useState<string>("");
  const [audioBuffer, setAudioBuffer] = useState<Buffer>();
  const [leechingTorrent, setLeechingTorrent] = useState<string>();
  const [dspeed, setDspeed] = useState(0);
  const { isRecording, stop, start } = useVoiceRecorder(async (data) => {
    // convert the data into a buffer and save it to state.
    setAudioBuffer(Buffer.from(await data.arrayBuffer()));
    console.log(data);
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
    console.log(audioBuffer);
    client.seed(audioBuffer, {}, (torrent) => {
      console.log("torrent is created and seeding!", torrent);
      console.log("magnet link\n", torrent.magnetURI);
      setMagnetLink(torrent.magnetURI);
    });
  };

  const startLeeching = (magnetLink: string) => {
    try {
      client.add(magnetLink, {}, (torrent) => {
        console.log("started leeching", torrent);
        torrent.files[0].getBlob((err, blob) => {
          setLeechingTorrent(window.URL.createObjectURL(blob));
        });
      });
    } catch (err) {
      console.error(err);
    }
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
