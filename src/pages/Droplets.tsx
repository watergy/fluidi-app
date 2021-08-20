// TODO: remove unused cordova packages
import { useEffect, useReducer, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { base64StringToBlob } from "blob-util";
import ComposeDroplet from "../components/ComposeDroplet";
import State from "../services/State";
import WebTorrent from "webtorrent";
import { Blob } from "node:buffer";

interface Droplet {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  tags?: string[];
  base64: string;
}

// TODO: a better job at declaring type definitions

const initialState = {
  droplets: [],
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "addDroplet":
      return { ...state, droplets: [...state.droplets, action.payload] };
  }
}

const Droplets = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    State.public
      .get("fluiditestexp")
      .get("droplets")
      .map()
      .on((ack: any) => {
        console.log(ack);
        dispatch({
          type: "addDroplet",
          payload: {
            title: ack.title,
            createdAt: ack.createdAt,
            author: ack.author,
            base64: ack.base64,
            tags: ack.tags,
          },
        });
      });
  }, []);

  const getMoreDroplets = () => {
    return state.droplets;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton>
              <IonIcon icon="menu-outline" />
            </IonButton>
          </IonButtons>
          <IonTitle>Droplets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ComposeDroplet />
        <InfiniteScroll
          dataLength={state.droplets.length}
          next={getMoreDroplets}
          hasMore={false}
          loader={<h1>syncing...</h1>}
          endMessage={<p>that's all!</p>}
        >
          <IonList>
            {[...new Set<Droplet>(state.droplets)].map((droplet: Droplet) => {
              return <Droplet {...droplet} />;
            })}
          </IonList>
        </InfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

function Droplet({ title, author, createdAt, tags = [], base64 }: Droplet) {
  const [audioUrl, setAudioUrl] = useState<string>();

  useEffect(() => {
    // const reader = new window.FileReader();
    // reader.readAsText(data);
    // reader.onloadend = () => {
    //   let base64 = reader.result!;
    //   base64 = String(base64).split(",")[1];
    //   console.log(base64);
    //   setBase64(base64);
    //   console.log(data);
    //   setRecord(window.URL.createObjectURL(data));
    // };

    if (!base64) return;
    const blob = base64StringToBlob(base64, "audio/wav");
    setAudioUrl(window.URL.createObjectURL(blob));
  }, []);

  return (
    <IonItem>
      <IonCard>
        <IonCardHeader>
          <IonText>{title}</IonText>
        </IonCardHeader>
        <IonCardContent>
          <IonText className="author-text">{author}</IonText>
          <audio src={audioUrl} controls></audio>
        </IonCardContent>
        <IonNote>{tags.length}</IonNote>
        <IonNote>{tags.map((tag) => `${tag}, `)}</IonNote>
      </IonCard>
    </IonItem>
  );
}

export default Droplets;
