import { useEffect, useState } from "react";
import { IonButton, IonInput, IonPage, IonText, IonTitle } from "@ionic/react";
import { v4 as uuidv4 } from "uuid";
import Gun from "gun";
import State from "../services/State";

const peerConnection = new RTCPeerConnection();
const SEA = Gun.SEA;

const Whirlpool = () => {
  const [myId, setMyId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const id = uuidv4();
    setMyId(id);
    console.log(id);
    State.public
      .get(id)
      .get("answers")
      .on((encryptedAnswer) => {
        console.log("encryptedAnswer!\n", encryptedAnswer);
        const password = prompt("enter the password. again. sorry...") || "";
        console.log("password", password);
        SEA.decrypt(encryptedAnswer, password).then((answer) => {
          console.log("cleartext answer", answer);
          // @ts-ignore
          peerConnection.setRemoteDescription(answer);

          // we need to get the ice candidates now
          // ...

          // NOW we can start doing peer to peer stuff, I think
          startChatting();
        });
      });
  }, []);

  async function startCall() {
    try {
      const _password = prompt("enter a password");
      setPassword(_password as string);
      // create an offer and set the local description
      const description = await peerConnection.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await peerConnection.setLocalDescription(description);
      // save the description to GUN. It's important that we encrypt this because our local IP address will be exposed in the description
      const encryptedDescription = await SEA.encrypt(description, password);
      console.log(encryptedDescription);
      State.public
        .get(myId)
        .get("offer")
        // @ts-ignore
        .put(encryptedDescription);
    } catch (err) {
      console.error(err);
    }
  }

  async function joinCall() {
    const friendId = prompt("enter your friend's id") || "";
    State.public
      .get(friendId)
      .get("offer")
      .on((encryptedDescription) => {
        console.log(encryptedDescription);
        const password = prompt("enter the passphrase") || "";
        SEA.decrypt(encryptedDescription, password).then(
          (cleartextDescription) => {
            console.log(cleartextDescription);
            if (cleartextDescription) {
              // @ts-ignore
              peerConnection.setRemoteDescription(cleartextDescription);
              peerConnection
                .createAnswer({
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: true,
                })
                .then((answer) => {
                  console.log(answer);
                  peerConnection.setLocalDescription(answer);
                  SEA.encrypt(answer, password).then((encryptedAnswer) => {
                    State.public
                      .get(friendId)
                      .get("answers")
                      // @ts-ignore
                      .put(encryptedAnswer);
                  });
                });
            }
          }
        );
      });
  }

  async function startChatting() {
    navigator.getUserMedia(
      { audio: true },
      (stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.start(1500);
        recorder.addEventListener("dataavailable", (blobEvent) => {
          console.log(blobEvent);
        });
        setTimeout(() => {
          recorder.stop();
        }, 5000);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  return (
    <IonPage>
      <IonTitle>Whirlpool</IonTitle>
      <IonText>your id: {myId}</IonText>
      <video id="video" />
      <IonButton onClick={startCall}>Start a call</IonButton>
      <IonButton onClick={joinCall}>Join a call</IonButton>
    </IonPage>
  );
};

export default Whirlpool;
