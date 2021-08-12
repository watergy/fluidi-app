import { IonButton, IonInput, IonLabel, IonText } from "@ionic/react";
import { Dispatch, SetStateAction, useState } from "react";
import gun from "../gun";

interface Props {
  setAuthKeysSaved: Dispatch<SetStateAction<boolean>>;
}

const LoginForm = ({ setAuthKeysSaved }: Props) => {
  const [alias, setAlias] = useState("");
  const user = gun.user();

  return (
    <form
      className="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        // generate a strong random password
        const pass =
          Math.random().toString(36).slice(2) +
          Math.random().toString(36).slice(2);

        user.create(alias, pass, (ack) => {
          console.log("ack from creation", ack);
          user.auth(alias, pass, (ack) => {
            console.log("ack from auth", ack.sea);
            localStorage.setItem("authKeys", JSON.stringify(ack.sea));
            setAuthKeysSaved(true);
          });
        });
      }}
    >
      <IonLabel>What should we call you?</IonLabel>
      <IonInput
        placeholder="type here"
        value={alias}
        onIonChange={(e) => setAlias(e.detail!.value!)}
        autofocus
      />
      <IonButton type="submit" className="login-btn">
        <IonText>Login</IonText>
      </IonButton>
    </form>
  );
};

export default LoginForm;
