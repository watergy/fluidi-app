import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Auth from "./pages/Auth";
import State from "./services/State";
import Session from "./services/Session";
import PeerManager from "./services/PeerManager";
import { useEffect, useState } from "react";
import Droplets from "./pages/Droplets";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Waves from "./pages/Waves";
import TorrentMachine from "./services/WebTorrent";
import Whirlpool from "./pages/Whirlpool";
import Waterfall from "./pages/Waterfall";

State.init({});
Session.init({ autologin: window.location.pathname.length > 2 });
PeerManager.init();

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    TorrentMachine.init({});
    // set listeners for some state changes
    State.local.get("loggedIn").on((ack: any) => {
      setLoggedIn(Boolean(ack)); // in case we get some other data type for some reason. shouldn't happen. probably would be fine even if it did beacause it would be truthy. why risk it? easier to just wrap it in a Boolean constructor and write this comment
    });
  }, []);

  if (!loggedIn) return <Auth />;

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/droplets">
              <Droplets />
            </Route>
            <Route exact path="/waves">
              <Waves />
            </Route>
            <Route exact path="/messages">
              <Messages />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/whirlpool">
              <Whirlpool />
            </Route>
            <Route exact path="/waterfall">
              <Waterfall />
            </Route>
            <Route exact path="/">
              <Redirect to="/waterfall" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon icon={triangle} />
              <IonLabel>Tab 1</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={ellipse} />
              <IonLabel>Tab 2</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={square} />
              <IonLabel>Tab 3</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
