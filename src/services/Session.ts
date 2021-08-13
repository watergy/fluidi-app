// @ts-nocheck
import Gun from "gun";
import State from "./State";
import Notifications from "./Notifications";
import Helpers from "./Helpers";
import PeerManager from "./PeerManager";
import iris from "iris-lib";
import _ from "lodash";
// import Fuse from "fuse";

let key: any;
let myName: string;
let myProfilePhoto: any;
let latestChatLink: any;
let onlineTimeout: NodeJS.Timeout;
let ourActivity: string | null;
let hasFollowers: any;
let hasFollows: any;
let userSearchIndex: Fuse;
const follows: any = {};
const channels: any = ((window as any).channels = {});

const DEFAULT_SETTINGS = {
  electron: {
    openAtLogin: true,
    minimizeOnClose: true,
  },
  local: {
    enableWebtorrent: !iris.util.isMobile,
    enablePublicPeerDiscovery: true,
    autoplayWebtorrent: true,
    maxConnectedPeers: Helpers.isElectron ? 2 : 1,
  },
};

const settings = DEFAULT_SETTINGS;

function getExtendedFollows(
  callback: { (k: any, info: any): void; (arg0: any, arg1: any): void },
  k: undefined,
  maxDepth = 3,
  currentDepth = 1
) {
  k = k || key.pub;

  function addFollow(
    k: string | number,
    followDistance: number,
    follower: undefined
  ) {
    if (follows[k]) {
      if (follows[k].followDistance > followDistance) {
        follows[k].followDistance = followDistance;
      }
      follows[k].followers.add(follower);
    } else {
      follows[k] = {
        key: k,
        followDistance,
        followers: new Set(follower && [follower]),
      };
      State.public
        .user(k)
        .get("profile")
        .get("name")
        .on((name: any) => {
          follows[k].name = name;
          callback(k, follows[k]);
        });
    }
    callback(k, follows[k]);
  }

  function removeFollow(
    k: string | number,
    followDistance: number,
    follower: any
  ) {
    if (follows[k]) {
      follows[k].followers.delete(follower);
      if (followDistance === 1) {
        State.local.get("groups").get("follows").get(k).put(false);
      }
    }
  }

  addFollow(k, currentDepth - 1);

  let n = 0;
  State.public
    .user(k)
    .get("follow")
    .map()
    .on((isFollowing: any, followedKey: string | number) => {
      // TODO: unfollow
      if (follows[followedKey] === isFollowing) {
        return;
      }
      if (isFollowing) {
        n = n + 1;
        addFollow(followedKey, currentDepth, k);
        if (currentDepth < maxDepth) {
          setTimeout(() => {
            // without timeout the recursion hogs CPU. or should we use requestAnimationFrame instead?
            getExtendedFollows(
              callback,
              followedKey,
              maxDepth,
              currentDepth + 1
            );
          }, n * 100);
        }
      } else {
        removeFollow(followedKey, currentDepth, k);
      }
    });

  return follows;
}

function getUserSearchIndex() {
  return userSearchIndex;
}

function setOurOnlineStatus() {
  const activeRoute = window.location.pathname;
  iris.Channel.setActivity(State.public, (ourActivity = "active"));
  const setActive = _.debounce(() => {
    const chat =
      activeRoute &&
      channels[activeRoute.replace("/profile/", "").replace("/chat/", "")];
    if (chat && !ourActivity) {
      chat.setMyMsgsLastSeenTime();
    }
    iris.Channel.setActivity(State.public, (ourActivity = "active")); // TODO: also on keypress
    clearTimeout(onlineTimeout);
    onlineTimeout = setTimeout(
      () => iris.Channel.setActivity(State.public, (ourActivity = "online")),
      30000
    );
  }, 1000);
  document.addEventListener("touchmove", setActive);
  document.addEventListener("mousemove", setActive);
  document.addEventListener("keypress", setActive);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      iris.Channel.setActivity(State.public, (ourActivity = "active"));
      const chatId = activeRoute.replace("/profile/", "").replace("/chat/", "");
      const chat = activeRoute && channels[chatId];
      if (chat) {
        chat.setMyMsgsLastSeenTime();
        Notifications.changeChatUnseenCount(chatId, 0);
      }
    } else {
      iris.Channel.setActivity(State.public, (ourActivity = "online"));
    }
  });
  setActive();
  window.addEventListener("beforeunload", () => {
    iris.Channel.setActivity(State.public, (ourActivity = null));
  });
}

function updateGroups() {
  getExtendedFollows(
    (k: any, info: { followDistance: number; followers: { size: any } }) => {
      if (!hasFollows && info.followDistance >= 1) {
        State.local.get("noFollows").put(false);
      }
      if (info.followDistance <= 1) {
        State.local.get("groups").get("follows").get(k).put(true);
      } else if (info.followDistance == 2) {
        State.local.get("groups").get("2ndDegreeFollows").get(k).put(true);
      }
      State.local.get("groups").get("everyone").get(k).put(true);
      if (!hasFollowers && k === getPubKey() && info.followers.size) {
        State.local.get("noFollowers").put(false);
      }
    }
  );
}

function login(k: CryptoKeyPair | undefined) {
  const shouldRefresh = !!key;
  key = k;
  localStorage.setItem("chatKeyPair", JSON.stringify(k));
  iris.Channel.initUser(State.public, key);
  Notifications.subscribeToWebPush();
  Notifications.getWebPushSubscriptions();
  iris.Channel.getMyChatLinks(
    State.public,
    key,
    undefined,
    (chatLink: { id: any; url: any }) => {
      State.local.get("chatLinks").get(chatLink.id).put(chatLink.url);
      latestChatLink = chatLink.url;
    }
  );
  setOurOnlineStatus();
  iris.Channel.getChannels(State.public, key, addChannel);
  let chatId =
    Helpers.getUrlParameter("chatWith") || Helpers.getUrlParameter("channelId");
  let inviter = Helpers.getUrlParameter("inviter");
  function go() {
    if (inviter !== key.pub) {
      newChannel(chatId, window.location.href);
    }
    _.defer(() => route(`/chat/${chatId}`)); // defer because router is only initialised after login
    window.history.pushState(
      {},
      "Iris Chat",
      `/${
        window.location.href
          .substring(window.location.href.lastIndexOf("/") + 1)
          .split("?")[0]
      }`
    ); // remove param
  }
  if (chatId) {
    if (inviter) {
      setTimeout(go, 2000); // wait a sec to not re-create the same chat
    } else {
      go();
    }
  }
  State.public
    .user()
    .get("profile")
    .get("name")
    .on((name: any) => {
      if (name && typeof name === "string") {
        myName = name;
      }
    });
  State.public
    .user()
    .get("profile")
    .get("photo")
    .on((data: any) => {
      myProfilePhoto = data;
    });
  State.public.get("follow").put({ a: null });
  State.local.get("groups").get("follows").put({ a: null });
  Notifications.init();
  State.local.get("loggedIn").put(true);
  State.public
    .user()
    .get("block")
    .map()
    .on((isBlocked: any, user: string | number) => {
      State.local.get("block").get(user).put(isBlocked);
      if (isBlocked) {
        delete follows[user];
      }
    });
  updateGroups();
  State.public.user().get("msgs").put({ a: null }); // These need to be initialised for some reason, otherwise 1st write is slow
  State.public.user().get("replies").put({ a: null });
  State.public.user().get("likes").put({ a: null });
  if (shouldRefresh) {
    window.location.reload();
  }
  State.electron &&
    State.electron
      .get("settings")
      .on(
        (electron: {
          publicIp?: any;
          openAtLogin?: boolean;
          minimizeOnClose?: boolean;
        }) => {
          settings.electron = electron;
          if (electron.publicIp) {
            Object.values(channels).forEach(shareMyPeerUrl);
          }
        }
      );
  State.local
    .get("settings")
    .on(
      (local: {
        enableWebtorrent: boolean;
        enablePublicPeerDiscovery: boolean;
        autoplayWebtorrent: boolean;
        maxConnectedPeers: number;
      }) => {
        settings.local = local;
      }
    );
  State.local
    .get("filters")
    .get("group")
    .once()
    .then((v: any) => {
      if (!v) {
        State.local.get("filters").get("group").put("follows");
      }
    });
}

async function createChatLink() {
  latestChatLink = await iris.Channel.createChatLink(State.public, key);
}

function clearIndexedDB() {
  return new Promise((resolve) => {
    const r1 = window.indexedDB.deleteDatabase("State.local");
    const r2 = window.indexedDB.deleteDatabase("radata");
    let r1done: boolean;
    let r2done: boolean;
    const check = () => {
      r1done && r2done && resolve();
    };
    r1.onerror = r2.onerror = (e) => console.error(e);
    //r1.onblocked = r2.onblocked = e => console.error('blocked', e);
    r1.onsuccess = () => {
      r1done = true;
      check();
    };
    r2.onsuccess = () => {
      r2done = true;
      check();
    };
  });
}

function getMyChatLink() {
  return latestChatLink || Helpers.getProfileLink(key.pub);
}

function getKey() {
  return key;
}
function getMyName() {
  return myName;
}
function getMyProfilePhoto() {
  return myProfilePhoto;
}

async function logOut() {
  // TODO: remove subscription from your channels
  if (navigator.serviceWorker) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.pushManager) {
      reg.active.postMessage({ key: null });
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const hash = await iris.util.getHash(JSON.stringify(sub));
        Notifications.removeSubscription(hash);
        sub.unsubscribe && sub.unsubscribe();
      }
    }
  }
  clearIndexedDB();
  localStorage.clear();
  route("/");
  window.location.reload();
}

function getPubKey() {
  return key && key.pub;
}

function loginAsNewUser(name: string) {
  name = name || Helpers.generateName();
  return Gun.SEA.pair().then((k) => {
    login(k);
    name && State.public.user().get("profile").get("name").put(name);
    createChatLink();
  });
}

function init(options = {}) {
  let localStorageKey = localStorage.getItem("chatKeyPair");
  if (localStorageKey) {
    login(JSON.parse(localStorageKey));
  } else if (options.autologin) {
    loginAsNewUser();
  } else {
    clearIndexedDB();
  }
}

function getFollows() {
  return follows;
}

const myPeerUrl = (ip: any) => `http://${ip}:8767/gun`;

function shareMyPeerUrl(channel: { put: (arg0: string, arg1: string) => any }) {
  channel.put && channel.put("my_peer", myPeerUrl(settings.electron.publicIp));
}

function newChannel(pub: boolean | PropertyKey | undefined, chatLink: string) {
  if (!pub || Object.prototype.hasOwnProperty.call(channels, pub)) {
    return;
  }
  const chat = new iris.Channel({
    gun: State.public,
    key,
    chatLink,
    participants: pub,
  });
  addChannel(chat);
  return chat;
}

function addChannel(chat: {
  getId: () => any;
  latestTime: number;
  theirMsgsLastSeenDate: number | Date;
  messageIds: {};
  getLatestMsg: (arg0: (latest: any, info: any) => void) => any;
  notificationSetting: string;
  onMy: (arg0: string, arg1: (val: any) => void) => void;
  theirMsgsLastSeenTime: string | number;
  getTheirMsgsLastSeenTime: (arg0: (time: any) => void) => void;
  getMyMsgsLastSeenTime: (arg0: (time: any) => void) => void;
  myLastSeenTime: number | Date;
  latest: { time: number };
  isTyping: boolean;
  getTyping: (arg0: (isTyping: any) => void) => void;
  online: {};
  activity: any;
  uuid: any;
  participantProfiles: { [x: string]: { name: any } };
  on: (
    arg0: string,
    arg1: { (v: any): any; (v: any): any; (v: any): any }
  ) => void;
  getParticipants: (arg0: (participants: any) => void) => void;
  inviteLinks: { [x: string]: any };
  getChatLinks: (arg0: {
    callback: ({ url, id }: { url: any; id: any }) => void;
  }) => void;
  put: (arg0: string, arg1: unknown[]) => void;
  onTheir: (
    arg0: string,
    arg1: {
      (s: any, k: any, from: any): void;
      (call: any): void;
      (url: any, k: any, from: any): void;
    }
  ) => void;
  webPushSubscriptions: { [x: string]: any[] };
}) {
  let pub = chat.getId();
  if (channels[pub]) {
    return;
  }
  channels[pub] = chat;
  const chatNode = State.local.get("channels").get(pub);
  chatNode.get("latestTime").on((t: number) => {
    if (t && (!chat.latestTime || t > chat.latestTime)) {
      chat.latestTime = t;
    } else {
      chatNode.get("latestTime").put(chat.latestTime);
    }
  });
  chatNode.get("theirMsgsLastSeenTime").on((t: string | number | Date) => {
    if (!t) {
      return;
    }
    const d = new Date(t);
    if (!chat.theirMsgsLastSeenDate || chat.theirMsgsLastSeenDate < d) {
      chat.theirMsgsLastSeenDate = d;
    }
  });
  chat.messageIds = chat.messageIds || {};
  chat.getLatestMsg &&
    chat.getLatestMsg((latest: any, info: any) => {
      processMessage(pub, latest, info);
    });
  Notifications.changeChatUnseenCount(pub, 0);
  chat.notificationSetting = "all";
  chat.onMy("notificationSetting", (val: any) => {
    chat.notificationSetting = val;
  });
  //$(".chat-list").append(el);
  chat.theirMsgsLastSeenTime = "";
  chat.getTheirMsgsLastSeenTime((time: number) => {
    if (chat && time && time >= chat.theirMsgsLastSeenTime) {
      chat.theirMsgsLastSeenTime = time;
      chatNode.get("theirMsgsLastSeenTime").put(time);
    }
  });
  chat.getMyMsgsLastSeenTime((time: string | number | Date) => {
    chat.myLastSeenTime = new Date(time);
    if (chat.latest && chat.myLastSeenTime >= chat.latest.time) {
      Notifications.changeChatUnseenCount(pub, 0);
    }
    PeerManager.askForPeers(pub); // TODO: this should be done only if we have a chat history or friendship with them
  });
  chat.isTyping = false;
  chat.getTyping((isTyping: any) => {
    chat.isTyping = isTyping;
    State.local.get("channels").get(pub).get("isTyping").put(isTyping);
  });
  chat.online = {};
  iris.Channel.getActivity(
    State.public,
    pub,
    (activity: { lastActive: any; isActive: any; status: any }) => {
      if (chat) {
        chatNode.put({
          theirLastActiveTime: activity && activity.lastActive,
          activity: activity && activity.isActive && activity.status,
        });
        chat.activity = activity;
      }
    }
  );
  if (chat.uuid) {
    let isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    chat.participantProfiles = {};
    chat.on("name", (v: any) =>
      State.local.get("channels").get(chat.uuid).get("name").put(v)
    );
    chat.on("photo", (v: any) =>
      State.local.get("channels").get(chat.uuid).get("photo").put(v)
    );
    chat.on("about", (v: any) =>
      State.local.get("channels").get(chat.uuid).get("about").put(v)
    );
    chat.getParticipants((participants: { [x: string]: any }) => {
      if (typeof participants === "object") {
        let keys = Object.keys(participants);
        keys.forEach((k, i) => {
          let hue = (360 / Math.max(keys.length, 2)) * i; // TODO use css filter brightness
          chat.participantProfiles[k] = {
            permissions: participants[k],
            color: `hsl(${hue}, 98%, ${isDarkMode ? 80 : 33}%)`,
          };
          State.public
            .user(k)
            .get("profile")
            .get("name")
            .on((name: any) => {
              chat.participantProfiles[k].name = name;
            });
        });
      }
      State.local.get("channels").get(chat.uuid).get("participants").put(null);
      State.local
        .get("channels")
        .get(chat.uuid)
        .get("participants")
        .put(participants);
    });
    chat.inviteLinks = {};
    chat.getChatLinks({
      callback: ({ url, id }) => {
        console.log("got chat link", id, url);
        chat.inviteLinks[id] = url; // TODO use State
        State.local.get("inviteLinksChanged").put(true);
      },
    });
  } else {
    State.public
      .user(pub)
      .get("profile")
      .get("name")
      .on((v: any) => State.local.get("channels").get(pub).get("name").put(v));
  }
  if (chat.put) {
    chat.onTheir("webPushSubscriptions", (s: any, k: any, from: any) => {
      if (!Array.isArray(s)) {
        return;
      }
      chat.webPushSubscriptions = chat.webPushSubscriptions || {};
      chat.webPushSubscriptions[from || pub] = s;
    });
    const arr = Object.values(Notifications.webPushSubscriptions);
    setTimeout(() => chat.put("webPushSubscriptions", arr), 5000);
    if (settings.electron && settings.electron.publicIp) {
      shareMyPeerUrl(chat);
    }
  }
  chat.onTheir("call", (call: any) => {
    State.local.get("call").put({ pub, call });
  });
  State.local.get("channels").get(pub).put({ enabled: true });
  if (chat.onTheir) {
    chat.onTheir("my_peer", (url: any, k: any, from: any) => {
      console.log("Got private peer url", url, "from", from);
      PeerManager.addPeer({ url, from });
    });
  }
}

function processMessage(
  chatId: string | number,
  msg: {
    time: string | number | Date;
    selfAuthored: any;
    from: string | any[];
    timeObj: number | Date;
    text: any;
  },
  info: { from: any; selfAuthored: any }
) {
  const chat = channels[chatId];
  if (chat.messageIds[msg.time + info.from]) return;
  chat.messageIds[msg.time + info.from] = true;
  if (info) {
    msg = Object.assign(msg, info);
  }
  msg.selfAuthored = info.selfAuthored;
  State.local
    .get("channels")
    .get(chatId)
    .get("msgs")
    .get(msg.time + (msg.from && msg.from.slice(0, 10)))
    .put(JSON.stringify(msg));
  msg.timeObj = new Date(msg.time);
  if (!info.selfAuthored && msg.timeObj > (chat.myLastSeenTime || -Infinity)) {
    if (
      window.location.pathname !== `/chat/${chatId}` ||
      document.visibilityState !== "visible"
    ) {
      Notifications.changeChatUnseenCount(chatId, 1);
    } else if (ourActivity === "active") {
      chat.setMyMsgsLastSeenTime();
    }
  }
  if (!info.selfAuthored && msg.time > chat.theirMsgsLastSeenTime) {
    State.local
      .get("channels")
      .get(chatId)
      .get("theirMsgsLastSeenTime")
      .put(msg.time);
  }
  if (!chat.latestTime || msg.time > chat.latestTime) {
    State.local
      .get("channels")
      .get(chatId)
      .put({
        latestTime: msg.time,
        latest: {
          time: msg.time,
          text: msg.text,
          selfAuthored: info.selfAuthored,
        },
      });
  }
  Notifications.notifyMsg(msg, info, chatId);
}

function subscribeToMsgs(pub: string | number) {
  const c = channels[pub];
  if (c.subscribed) {
    return;
  }
  c.subscribed = true;
  c.getMessages((msg: any, info: any) => {
    processMessage(pub, msg, info);
  });
}

function followChatLink(str: string) {
  if (str && str.indexOf("http") === 0) {
    const s = str.split("?");
    let chatId;
    if (s.length === 2) {
      chatId =
        Helpers.getUrlParameter("chatWith", s[1]) ||
        Helpers.getUrlParameter("channelId", s[1]);
    }
    if (chatId) {
      newChannel(chatId, str);
      route(`/chat/${chatId}`);
      return true;
    }
    if (str.indexOf("https://iris.to") === 0) {
      route(str.replace("https://iris.to", ""));
      return true;
    }
  }
}

export default {
  init,
  followChatLink,
  getKey,
  getPubKey,
  getUserSearchIndex,
  getMyName,
  getMyProfilePhoto,
  getMyChatLink,
  createChatLink,
  ourActivity,
  login,
  logOut,
  getFollows,
  loginAsNewUser,
  DEFAULT_SETTINGS,
  settings,
  channels,
  newChannel,
  addChannel,
  processMessage,
  subscribeToMsgs,
};
