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
  setAudioBuffer: (buffer: Buffer) => void;
}

const AudioRecorder = ({ setAudioBuffer }: AudioRecorderProps) => {
  const [record, setRecord] = useState<string>("");
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
    </div>
  );
};

export default AudioRecorder;
