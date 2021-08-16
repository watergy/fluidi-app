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

interface Droplet {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  tags?: string[];
  audioUrl?: string;
}

// TODO: a better job at declaring type definitions

const initialState = {
  droplets: [],
  // droplets: [
  //   {
  //     id: "1",
  //     title: "my first droplet",
  //     tags: ["fun", "strange", "loud"],
  //     author: "chance",
  //     createdAt: Date.now(),
  //   },
  // ],
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
    State.local
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

function Droplet({ title, author, createdAt, tags, audioUrl = "" }: Droplet) {
  return (
    <IonItem>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>{author}</IonCardContent>
        {}
        <IonNote>{tags?.map((tag) => `${tag}, `)}</IonNote>
      </IonCard>
    </IonItem>
  );
}

export default Droplets;
