import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import "./Login.css";

interface LoginProps {
  setAuthKeysSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setAuthKeysSaved }: LoginProps) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>fluidi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonTitle>welcome to fluidi</IonTitle>
        </IonHeader>
        <LoginForm setAuthKeysSaved={setAuthKeysSaved} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
