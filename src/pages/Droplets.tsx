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
import ComposeDroplet from "../components/ComposeDroplet";
import State from "../services/State";
import WebTorrent from "webtorrent";

interface Droplet {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  tags?: string[];
  magnetLink: string;
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
      .get("dropletss")
      .map()
      .on((ack: any) => {
        console.log(ack);
        dispatch({
          type: "addDroplet",
          payload: {
            title: ack.title,
            createdAt: ack.createdAt,
            author: ack.author,
            magnetLink: ack.magnetLink,
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
            {state.droplets.map((droplet: Droplet) => {
              return <Droplet {...droplet} />;
            })}
          </IonList>
        </InfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

function Droplet({ title, author, createdAt, tags, magnetLink }: Droplet) {
  const [audioUrl, setAudioUrl] = useState<string>();
  const client = new WebTorrent();

  const startLeeching = (magnetLink: string) => {
    try {
      client.add(magnetLink, {}, (torrent) => {
        console.log("started leeching", torrent);
        torrent.files[0].getBlob((err, blob) => {
          setAudioUrl(window.URL.createObjectURL(blob));
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startLeeching(magnetLink);
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
        <IonNote>{tags?.map((tag) => `${tag}, `)}</IonNote>
      </IonCard>
    </IonItem>
  );
}

export default Droplets;
